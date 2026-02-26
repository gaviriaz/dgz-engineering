# DGZ Engineering

_Engineering Spatial Intelligence_

Geospatial & Spatial Systems Engineering portfolio built and maintained by **Albert Daniel Gaviria Zapata**.

## Capabilities
- **GIS Automation**: PyQGIS, Custom QGIS Plugins, Automation Pipelines.
- **Spatial Data Engineering**: PostGIS, Data Modeling, ETL Processes.
- **Dashboard Systems**: Interactive Web GIS, Leaflet.js, Real-time Monitoring.
- **Spatial Analytics**: Geoprocessing, Advanced Analysis, Spatial Intelligence. 

## Structure
- `/assets`: Site assets (CSS, JS, Media, CV).
- `/projects`: Deep dive into core technical developments.
- `/components`: Reusable UI elements for technical interfaces.

## Technology Stack
- **Frontend**: HTML5, Vanilla CSS (Glassmorphism), JavaScript (ES6+).
- **Libraries**: Leaflet.js (Interactive Mapping).
- **Branding**: Dark technical aesthetic with Geospatial Grid systems.

## Contact
Connect for complex spatial architecture and automation workflows.
[dgzengineering.com](https://gaviriaz.github.io/dgz-engineering)

## Master Execution Blueprint & Backend (added)

Files added:
- `MASTER_EXECUTION_BLUEPRINT.md` — high-level plan and roadmap.
- `backend/fastapi/app/main.py` — FastAPI skeleton with `/validate`, `/topology`, and `/parcel_score` endpoints.
- `backend/fastapi/requirements.txt` — Python deps for the API.
- `geoai/change_detection.py` — reproducible change detection script (Rasterio + NumPy).

Run the API locally (PowerShell / CMD):

```powershell
python -m pip install -r backend/fastapi/requirements.txt
uvicorn backend.fastapi.app.main:app --reload --host 127.0.0.1 --port 8000
```

Notes:
- The `/validate` endpoint is a starter, in-memory validator. For production hook it to PostGIS + spatial indexes.
- Use the `geoai/change_detection.py` as a PoC: provide two co-registered rasters and export GeoJSON change polygons.

Windows local setup (no Docker Desktop)
See `docs/windows_setup.md` for step-by-step instructions to install PostgreSQL/PostGIS on Windows,
run `backend/fastapi/setup_local_db.ps1` to create the database and enable PostGIS, and start the API locally.

Deploy to GitHub Pages (zero cost)
- The site is fully static and can be hosted on GitHub Pages for $0. To keep everything free and inside the repo, we switched the validator
    to run client-side validations via Turf.js when no backend `API_BASE` is configured. This makes the full demo runnable on GitHub Pages.

Steps to publish on GitHub Pages (project site, zero cost):

1. Push your repo to GitHub.
2. In the repository Settings → Pages, set the source to the `main` branch and folder `/ (root)` or `/docs` depending on preference.
     - If GitHub requires a branch, create a `gh-pages` branch with the compiled/static site.
3. Wait a few minutes and open the provided GitHub Pages URL (e.g., `https://<user>.github.io/<repo>`).
4. Open `/lab/validator.html` on the published site — the validator will run entirely client-side (Turf.js) and cost $0.

Do you want me to commit these GitHub Pages instructions into the repo as a short `docs/deploy_github_pages.md` and create a branch
`feature/gh-pages-ready` with the changes ready to push? This will leave the repo ready for publish without any paid services like Firebase.


