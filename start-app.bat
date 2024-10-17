@echo off

:: Starte Docker Desktop
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

:: Warte, bis Docker Desktop vollständig hochgefahren ist
echo Warte auf den Start von Docker Desktop...
timeout /t 20 /nobreak >nul

:: Überprüfe, ob Docker bereit ist
:check_docker
docker info >nul 2>&1
if errorlevel 1 (
    echo Docker Desktop wird noch gestartet...
    timeout /t 5 /nobreak >nul
    goto check_docker
)

:: Führe Docker Compose aus
docker-compose up -d --build
start http://localhost:3001