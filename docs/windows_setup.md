# Local Windows setup (PostgreSQL + PostGIS) — DGZ Engineering

Este documento describe los pasos para dejar el proyecto 100% funcional en Windows sin usar Docker Desktop.

Requisitos previos
- Instalar PostgreSQL para Windows (EnterpriseDB): https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
- Durante la instalación, anota la contraseña del usuario `postgres`.
- Opción alternativa: usar Postgres de WSL si prefieres Linux dentro de Windows.

1) Verificar `psql` en PATH
Abra PowerShell y ejecute:

```powershell
psql --version
```

2) Crear usuario y base de datos y habilitar PostGIS
- Desde PowerShell, en la carpeta `backend/fastapi` ejecuta:

```powershell
cd backend/fastapi
.\setup_local_db.ps1
```

El script solicitará la contraseña del superusuario y creará:
- Role `dgz` con contraseña `dgzpass` (puedes cambiarla manualmente después)
- Base de datos `cadastre_db` con propietario `dgz`
- Extensiones `postgis` y `postgis_topology` en `cadastre_db`.

3) Configurar variables de entorno para la API
- Copia `.env.example` a `.env` y ajusta si necesitas:

```powershell
copy .env.example .env
# (editar si cambia la contraseña o host)
```

4) Crear entorno Python e instalar dependencias

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

5) Ejecutar la API

```powershell
# estando en backend/fastapi y con el venv activado
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

6) Servir frontend estático localmente (opcional)

```powershell
# desde la raíz del repo
python -m http.server 8080
# abrir http://localhost:8080/lab/validator.html
```

7) Ajustar `API base` en `lab/validator.html` a `http://127.0.0.1:8000` y probar.

Notas y seguridad
- Cambia la contraseña `dgzpass` en entornos reales. Usa usuarios/roles y privilegios mínimos.
- Para producción, usa SSL/TLS y no dejes credenciales en texto plano.