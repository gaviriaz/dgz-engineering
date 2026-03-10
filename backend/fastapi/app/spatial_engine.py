import time
from shapely.geometry import shape
from shapely.strtree import STRtree
from typing import List, Dict, Any
from .schemas import GeoJSONFeature

def validate_collection_topology(features: List[GeoJSONFeature]) -> Dict[str, Any]:
    """
    Expert-level topological validation engine.
    """
    start_time: float = time.time()
    geoms: List[Any] = []
    errors: List[Dict[str, Any]] = []
    
    for idx, feat in enumerate(features):
        try:
            geom = shape(feat.geometry)
            
            # 1. Validity
            if not geom.is_valid:
                errors.append({"id": idx, "type": "INVALID_GEOMETRY", "details": "Geometry is not simple or self-intersects."})
            
            # 2. Slivers
            if geom.area < 0.01:
                errors.append({"id": idx, "type": "SLIVER_DETECTED", "details": f"Area ({geom.area}) is below threshold."})
            
            geoms.append(geom)
        except Exception as e:
            errors.append({"id": idx, "type": "PARSING_ERROR", "details": str(e)})

    # 3. Global Overlaps (Optimized via STRtree)
    overlaps_count: int = 0
    if len(geoms) > 1:
        tree: STRtree = STRtree(geoms)
        
        for i, geom in enumerate(geoms):
            # Safe query for indices
            potential_indices: Any = tree.query(geom)
            for raw_idx in potential_indices:
                idx: int = int(raw_idx)
                if idx > i:
                    other_geom: Any = geoms[idx]
                    if geom.intersects(other_geom):
                        intersection_area: float = float(geom.intersection(other_geom).area)
                        if intersection_area > 0.0001:
                            overlaps_count = int(overlaps_count + 1)

    execution_time: float = float((time.time() - start_time) * 1000)
    
    return {
        "diagnostics": {
            "features_processed": int(len(geoms)),
            "errors_found": int(len(errors)),
            "overlaps_detected": int(overlaps_count),
            "execution_time_ms": float(round(execution_time, 2))
        },
        "critical_errors": errors,
        "compliance": "FAIL" if (errors or overlaps_count > 0) else "PASS"
    }

def calculate_parcel_score(feature: GeoJSONFeature) -> Dict[str, Any]:
    """
    Calculates the 'Spatial Intelligence Score' for a parcel.
    """
    props: Dict[str, Any] = feature.properties
    weights: Dict[str, int] = {
        "npu": 30,
        "area_m2": 25,
        "uso": 20,
        "estrato": 15,
        "owner_info": 10
    }
    
    current_score: int = 0
    missing_nodes: List[str] = []
    
    for key, weight in weights.items():
        if key in props and props[key]:
            current_score = int(current_score + int(weight))
        else:
            missing_nodes.append(str(key))
            
    return {
        "intelligence_score": int(current_score),
        "max_threshold": 100,
        "compliance_gap": missing_nodes,
        "recommendation": "Hydrate missing attributes to reach Sovereign Status." if current_score < 70 else "High-fidelity spatial node."
    }
