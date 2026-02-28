import os
import json
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .core_validator import GeoQAValidator
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

# Integración Simulada Groq (A la espera de KEY oficial)
from groq import Groq if os.getenv('GROQ_API_KEY') else None

@app.get("/healthz")
def read_root():
    """Endpoint de salud para Render (Monitoreo Uptime)"""
    return {"status": "ok", "service": "DGZ QA Engine V1.0"}

def generar_reporte_llm(json_qaqc: dict) -> str:
    """Invoca Groq/Llama-3 para interpretar el reporte topológico."""
    # Dummy system prompt until real keys are provided
    system_prompt = \"\"\"
    Eres un auditor catastral Senior. Recibes este perfil JSON de errores espaciales.
    Tu trabajo es redactar un informe profesional diagnosticando la pérdida,
    riesgos y acciones correctivas. Todo en 3 viñetas.
    \"\"\"
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

@app.post("/api/v1/analyze-shapefile")
async def analyze_shapefile(file: UploadFile = File(...)):
    """
    Endpoint masivo:
    El cliente Frontend manda el shapefile en formato .geojson o comprimido.
    El backend Python corre las librerías Geopandas superpesadas en el servidor,
    devuelve un reporte topológico limpio y un análisis escrito por LLM.
    """
    if not file.filename.endswith(('.geojson', '.json')):
         raise HTTPException(status_code=400, detail="Use GeoJSON for this API demo")
         
    temp_path = f"/tmp/{file.filename}"
    
    # Escribir temporal
    with open(temp_path, "wb") as f:
         content = await file.read()
         f.write(content)
         
    try:
        # Motor de Control de Calidad
        validator = GeoQAValidator()
        gdf = validator.load_dataset(temp_path)
        
        # Resultados Topologicos Oficiales (Overlap, Area, Metadata LADM)
        qaqc_report = validator.run_full_qaqc(gdf)
        
        # Interpretación final del LLM
        final_assessment = generar_reporte_llm(qaqc_report)
        
        return {
            "file": file.filename,
            "status": "Processed",
            "qaqc_metrics": qaqc_report,
            "geo_llm_intelligence_report": final_assessment
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
