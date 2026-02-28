from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List
from shapely.geometry import shape

app = FastAPI(title="DGZ Engineering Spatial API")

# Configure CORS for GitHub Pages and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://gaviriaz.github.io",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class Feature(BaseModel):
    type: str
    properties: Dict[str, Any]
    geometry: Dict[str, Any]


class FeatureCollection(BaseModel):
    type: str
    features: List[Feature]


@app.get("/")
async def root():
    return {"service": "dgz-spatial-api", "status": "ok"}


@app.get("/healthz", status_code=200)
async def health_check():
    """Endpoint for Render's automated health checks."""
    return {"status": "healthy"}


@app.post("/validate")
async def validate(fc: FeatureCollection):
    """Basic topology validator (naive, in-memory).

    Receives a GeoJSON FeatureCollection and returns counts of invalid geometries
    and a basic overlaps count. This is a starter endpoint to evolve into
    a PostGIS-backed validator.
    """
    features = fc.features
    total = len(features)
    invalid = []
    geoms = []

    for idx, f in enumerate(features):
        try:
            g = shape(f.geometry)
            if not g.is_valid:
                invalid.append({"index": idx, "reason": "invalid geometry"})
            geoms.append(g)
        except Exception as e:
            invalid.append({"index": idx, "reason": str(e)})

    # Naive overlap count (O(n^2)) — replace with spatial index for production
    overlaps = 0
    for i in range(len(geoms)):
        for j in range(i + 1, len(geoms)):
            try:
                if geoms[i].intersects(geoms[j]):
                    overlaps += 1
            except Exception:
                continue

    return {"total": total, "invalid_count": len(invalid), "invalid": invalid, "overlaps": overlaps}


@app.get("/topology")
async def topology():
    return {"topology": "simple", "notes": "Hook into PostGIS topology or run advanced checks."}


@app.post("/parcel_score")
async def parcel_score(payload: Dict[str, Any]):
    # Simple heuristic: score based on presence of attributes
    props = payload.get("properties", {})
    score = 0
    if props.get("npu"): score += 40
    if props.get("area_m2"): score += 30
    if props.get("uso"): score += 15
    if props.get("estrato"): score += 15
    return {"score": score, "max": 100}
