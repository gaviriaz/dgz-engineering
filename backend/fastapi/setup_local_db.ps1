<#
PowerShell helper to create local user/database and enable PostGIS.

Usage:
  1. Install PostgreSQL for Windows (EnterpriseDB). Ensure `psql` is in PATH.
  2. Run this script in PowerShell (as a normal user):
     .\setup_local_db.ps1

The script will prompt for the PostgreSQL superuser name (default: postgres)
and its password, then create user `dgz` and database `cadastre_db` and enable
PostGIS extensions.
#>

Param()

function Read-PlainPassword($prompt = "Password") {
    $secure = Read-Host -AsSecureString -Prompt $prompt
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    $plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) | Out-Null
    return $plain
}

Write-Host "Postgres superuser name (default: postgres):" -NoNewline
$superUser = Read-Host
if (-not $superUser) { $superUser = 'postgres' }

$superPass = Read-PlainPassword "Enter password for superuser '$superUser'"
if (-not $superPass) {
    Write-Error "Password required. Aborting."
    exit 1
}

# Set temporary PGPASSWORD for psql calls
$env:PGPASSWORD = $superPass

try {
    Write-Host "Creating role 'dgz' (password: dgzpass) and database 'cadastre_db'..."
    & psql -U $superUser -h localhost -c "DO $$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'dgz') THEN CREATE ROLE dgz LOGIN PASSWORD 'dgzpass'; END IF; END $$;"

    & psql -U $superUser -h localhost -c "SELECT 1 FROM pg_database WHERE datname='cadastre_db'" | Out-Null
    $dbExists = ($LASTEXITCODE -eq 0) -and ((psql -U $superUser -h localhost -tAc "SELECT 1 FROM pg_database WHERE datname='cadastre_db'" ) -eq '1')
    if (-not $dbExists) {
        & psql -U $superUser -h localhost -c "CREATE DATABASE cadastre_db OWNER dgz;"
        Write-Host "Database 'cadastre_db' created."
    } else {
        Write-Host "Database 'cadastre_db' already exists. Skipping creation."
    }

    Write-Host "Enabling PostGIS extensions on 'cadastre_db'..."
    & psql -U $superUser -h localhost -d cadastre_db -c "CREATE EXTENSION IF NOT EXISTS postgis;"
    & psql -U $superUser -h localhost -d cadastre_db -c "CREATE EXTENSION IF NOT EXISTS postgis_topology;"

    Write-Host "Done. You can now set DATABASE_URL=postgres://dgz:dgzpass@localhost:5432/cadastre_db"
} catch {
    Write-Error "An error occurred: $_"
} finally {
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}
