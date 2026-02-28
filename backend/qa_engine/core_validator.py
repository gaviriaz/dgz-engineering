import geopandas as gpd
from shapely.validation import make_valid
import os

class GeoQAValidator:
    """
    Motor LADM-COL de Control de Calidad Catastral (QA/QC).
    Realiza validaciones topológicas y alfanuméricas sobre conjuntos de datos prediales.
    """
    
    def __init__(self, epsg_crs="EPSG:3116"): # Magna-Sirgas Origen Nacional
        self.crs = epsg_crs
        self.tolerance_area = 5.0  # Slivers menores a 5 m2
        
    def load_dataset(self, file_path: str) -> gpd.GeoDataFrame:
        """Carga un dataset geospatial (.shp, .geojson, .gpkg) en un GeoDataFrame."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Input file not found: {file_path}")
            
        gdf = gpd.read_file(file_path)
        if gdf.crs != self.crs:
            gdf = gdf.to_crs(self.crs)
        return gdf

    def validate_geometries(self, gdf: gpd.GeoDataFrame) -> dict:
        """Evalúa geometrías inválidas y las repara automáticamente."""
        invalid_count = (~gdf.is_valid).sum()
        
        # Auto-heal geometries
        gdf.geometry = gdf.geometry.apply(lambda geom: make_valid(geom) if not geom.is_valid else geom)
        
        return {
            "invalid_geometries_found": int(invalid_count),
            "status": "Healed" if invalid_count > 0 else "Clean"
        }

    def detect_slivers(self, gdf: gpd.GeoDataFrame) -> dict:
        """Detecta micro-polígonos (Slivers) típicamente producidos por errores de topología."""
        sliver_mask = gdf.geometry.area < self.tolerance_area
        slivers_count = sliver_mask.sum()
        sliver_ids = gdf[sliver_mask].index.tolist() # o la columna id/npu real
        
        return {
            "slivers_count": int(slivers_count),
            "sliver_indices": sliver_ids,
            "threshold_m2": self.tolerance_area
        }
        
    def detect_overlaps(self, gdf: gpd.GeoDataFrame) -> dict:
        """Detecta polígonos que se sobreponen con otros (regla topológica estricta)."""
        # Explicación: Para una base catastral LADM-COL, los predios no deben superponerse.
        # Una operación espacial avanzada requiere crear un sjoin consigo misma.
        overlaps_found = 0
        overlap_pairs = []
        
        if len(gdf) > 1:
            try:
                # Spatial join intersect with itself, keep only where left_id != right_id
                sjoined = gpd.sjoin(gdf, gdf, how='inner', predicate='intersects')
                real_overlaps = sjoined[sjoined.index != sjoined['index_right']]
                
                # Deduplicate backwards pairs
                unique_pairs = set()
                for idx, row in real_overlaps.iterrows():
                    pair = tuple(sorted((idx, row['index_right'])))
                    if pair not in unique_pairs:
                        unique_pairs.add(pair)
                        
                overlaps_found = len(unique_pairs)
                overlap_pairs = list(unique_pairs)
            except Exception as e:
                print(f"Overlap detection skipped due to complex topology: {e}")
                
        return {
            "overlaps_count": overlaps_found,
            "overlap_pairs": overlap_pairs
        }

    def check_ladm_mandatories(self, gdf: gpd.GeoDataFrame, required_columns: list) -> dict:
        """Verifica que los atributos mínimos del modelo LADM-COL estén presentes y no sean nulos."""
        missing_attrs = {}
        for col in required_columns:
            if col not in gdf.columns:
                missing_attrs[col] = "Column Missing Full"
            else:
                null_count = gdf[col].isnull().sum()
                if null_count > 0:
                    missing_attrs[col] = f"{null_count} Null values detected"
                    
        return {
            "alfanumeric_errors": missing_attrs,
            "check_status": "Passed" if not missing_attrs else "Failed"
        }

    def run_full_qaqc(self, gdf: gpd.GeoDataFrame, mandatory_fields=None) -> dict:
        """Pipeline oficial de Inteligencia Espacial."""
        if not mandatory_fields:
            mandatory_fields = ['npu', 'uso_suelo', 'codigo_homologado']
            
        ladm_compliance = self.check_ladm_mandatories(gdf, mandatory_fields)
        
        report = {
            "total_features": len(gdf),
            "geometry_val": self.validate_geometries(gdf),
            "slivers_val": self.detect_slivers(gdf),
            "topology_val": self.detect_overlaps(gdf),
            "ladm_col_compliance": ladm_compliance
        }
        return report

    def cross_reference_excel(self, gdf: gpd.GeoDataFrame, excel_path: str, join_col="npu") -> dict:
        """
        Módulo de Interoperabilidad: Cruce Físico-Jurídico (Catastro vs Registro).
        Compara la base cartográfica con una matriz tabular (Excel/CSV).
        """
        import pandas as pd
        import numpy as np
        
        # 1. Cargar Excel
        df_registral = pd.read_excel(excel_path) if excel_path.endswith('.xlsx') else pd.read_csv(excel_path)
        
        # Normalizar nombres de columnas a minúsculas para evitar errores de digitación
        gdf.columns = [c.lower() for c in gdf.columns]
        df_registral.columns = [c.lower() for c in df_registral.columns]
        join_col = join_col.lower()

        if join_col not in gdf.columns or join_col not in df_registral.columns:
            return {"error": f"Columna de unión '{join_col}' no encontrada en ambos archivos."}

        # 2. Identificar Diferencias de Existencia
        spatial_keys = set(gdf[join_col].unique())
        registral_keys = set(df_registral[join_col].unique())

        missing_in_spatial = registral_keys - spatial_keys
        missing_in_registral = spatial_keys - registral_keys

        # 3. Comparación de Áreas (si existe columna 'area')
        area_diffs = []
        common_keys = spatial_keys.intersection(registral_keys)
        
        # Aseguramos que el gdf tenga calculada la columna area_m2
        gdf['area_m2_calc'] = gdf.geometry.area

        for key in list(common_keys)[:100]: # Limitamos a los primeros 100 para el reporte resumen
            area_cat = gdf[gdf[join_col] == key]['area_m2_calc'].values[0]
            # Buscamos en registro (asumiendo columna 'area_snr' o similar, sino usamos lo que encontremos)
            area_col_snr = [c for c in df_registral.columns if 'area' in c]
            if area_col_snr:
                area_snr = df_registral[df_registral[join_col] == key][area_col_snr[0]].values[0]
                diff = abs(area_cat - area_snr)
                if diff > 1.0: # Tolerancia de 1m2
                    area_diffs.append({"id": str(key), "diff_m2": round(diff, 2)})

        return {
            "total_spatial": len(gdf),
            "total_registral": len(df_registral),
            "missing_geometries": len(missing_in_spatial),
            "missing_legal_records": len(missing_in_registral),
            "area_discrepancies_count": len(area_diffs),
            "sample_discrepancies": area_diffs[:5]
        }


# Ejemplo de uso interno (para pruebas expertas antes de conectar a API)
if __name__ == '__main__':
    validator = GeoQAValidator()
    print("Módulo QA/QC LADM-COL (DGZ Engine) activo y listo para integrarse a FastAPI.")
