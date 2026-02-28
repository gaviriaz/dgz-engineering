import os
import json
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from core_validator import GeoQAValidator
import geopandas as gpd

# Configuración FastAPI (Servicio de Backend DGZ)
app = FastAPI(
    title="DGZ Spatial Lab - QA/QC API",
    description="Motor Backend Analítico e Inteligencia Artificial para la convalidación de predios LADM-COL.",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permitir peticiones desde tu Frontend GitHub Pages
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    from groq import Groq
except ImportError:
    Groq = None

@app.get("/healthz")
def read_root():
    """Endpoint de salud para Render (Monitoreo Uptime)"""
    return {"status": "ok", "service": "DGZ QA Engine V1.0"}

def generar_reporte_llm(json_qaqc: dict) -> str:
    """Invoca Groq/Llama-3 para interpretar el reporte topológico."""
    # Dummy system prompt until real keys are provided
    system_prompt = """
    Eres un auditor catastral Senior. Recibes este perfil JSON de errores espaciales.
    Tu trabajo es redactar un informe profesional diagnosticando la pérdida,
    riesgos y acciones correctivas. Todo en 3 viñetas.
    """
    try:
        if "GROQ_API_KEY" in os.environ:
            client = Groq()
            completion = client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"El data report LADM-COL arroja esto: {json.dumps(json_qaqc)}. Genera el diagnostico."}
                ],
                temperature=0.7,
                max_tokens=500
            )
            return completion.choices[0].message.content
        return "Simulación LLM: 1,248 predios requieren sobrevuelo dron. Se detectó un margen de error catastral del 30% basado en Slivers detectados en QA/QC."
    except Exception as e:
        return f"Error LLM Connection: {str(e)}"

import tempfile
import zipfile
import shutil

@app.post("/api/v1/analyze-shapefile")
async def analyze_shapefile(file: UploadFile = File(...)):
    """
    Endpoint masivo:
    Acepta .zip (Shapefiles), .geojson, .gpkg, .kml.
    Retorna reporte topológico + informe LLM + GeoJSON limpio para visualización.
    """
    allowed_extensions = ('.geojson', '.json', '.zip', '.kml', '.gpkg', '.shp')
    if not file.filename.lower().endswith(allowed_extensions):
         raise HTTPException(status_code=400, detail=f"Extensión no soportada. Use {allowed_extensions}")
         
    # Directorio temporal para manejar zips y extracciones
    temp_dir = tempfile.mkdtemp()
    temp_file_path = os.path.join(temp_dir, file.filename)
    
    with open(temp_file_path, "wb") as f:
         content = await file.read()
         f.write(content)
         
    try:
        # Si es un ZIP, extraer y buscar el .shp principal
        target_path = temp_file_path
        if file.filename.lower().endswith('.zip'):
             extract_dir = os.path.join(temp_dir, "extracted")
             os.makedirs(extract_dir, exist_ok=True)
             with zipfile.ZipFile(temp_file_path, 'r') as zip_ref:
                 zip_ref.extractall(extract_dir)
             
             # Buscar el shapefile o geojson principal
             for root, dirs, files in os.walk(extract_dir):
                 for name in files:
                     if name.lower().endswith(('.shp', '.gpkg', '.geojson', '.kml')):
                         target_path = os.path.join(root, name)
                         break

        # Instanciar el Validador
        import fiona
        fiona.drvsupport.supported_drivers['KML'] = 'rw'
        fiona.drvsupport.supported_drivers['LIBKML'] = 'rw'
        
        validator = GeoQAValidator()
        gdf = validator.load_dataset(target_path)
        
        # QA/QC Oficial
        qaqc_report = validator.run_full_qaqc(gdf)
        
        # Reporte LLM Inteligente
        final_assessment = generar_reporte_llm(qaqc_report)
        
        # Convertir a GeoJSON para visualización en el frontend (proyección Web WGS84 - 4326)
        gdf_wgs84 = gdf.to_crs("EPSG:4326")
        geojson_data = json.loads(gdf_wgs84.to_json())
        
        return {
            "file": file.filename,
            "status": "Processed",
            "qaqc_metrics": qaqc_report,
            "geo_llm_intelligence_report": final_assessment,
            "geojson": geojson_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
