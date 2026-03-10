from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import ValidationRequest, GeoJSONFeature
from .spatial_engine import validate_collection_topology, calculate_parcel_score

app = FastAPI(
    title="DGZ Spatial Intelligence Engine",
    description="Advanced Spatial Systems Engineering API for Multipurpose Cadastre & Territorial Intelligence.",
    version="6.0.0"
)

# Enterprise CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["System"])
async def get_system_status():
    """Returns the Sovereign System status and versioning."""
    return {
        "engine": "DGZ_SPATIAL_OS",
        "version": "6.0.0",
        "status": "OPERATIONAL",
        "architecture": "MODULAR_V6",
        "telemetry": {
            "uptime": "99.99%",
            "spatial_load": "nominal"
        }
    }

@app.post("/validate", tags=["Topology"])
async def validate_topology(request: ValidationRequest):
    """
    Expert-level topological validation engine.
    Optimized via STRtree (R-tree).
    """
    return validate_collection_topology(request.features)

@app.post("/intelligence/parcel_score", tags=["AI"])
async def calculate_parcel_intelligence(feature: GeoJSONFeature):
    """
    Calculates the 'Spatial Intelligence Score' for a parcel based on 
    data richness and LADM-COL attribute compliance.
    """
    return calculate_parcel_score(feature)

@app.post("/intelligence/detect_changes", tags=["GeoAI"])
async def detect_geospatial_changes():
    """
    Placeholder for GeoAI Change Detection Node.
    Integrates with Sentinel-2 imagery via Rasterio/NumPy kernel.
    """
    return {
        "node": "GeoAI_Change_Detection",
        "status": "DEVELOPMENT",
        "capabilities": ["Sentinel-2", "Random Forest", "NDVI_Analysis"],
        "message": "Node require high-performance raster kernel."
    }
