from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional

class SpatialProperty(BaseModel):
    npu: Optional[str] = Field(None, description="Número Predial Unificado")
    area_m2: Optional[float] = Field(None, description="Calculated area in square meters")
    uso: Optional[str] = Field(None, description="Land use classification")
    estrato: Optional[int] = Field(None, ge=1, le=6, description="Socio-economic stratum")

class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    properties: Dict[str, Any]
    geometry: Dict[str, Any]

class ValidationRequest(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature]
