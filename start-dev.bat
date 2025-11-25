@echo off
echo ==========================================
echo   Starting Puzzle Generator (Dev Mode)
echo ==========================================

REM Check if venv exists
if not exist "server\venv" (
    echo [ERROR] Virtual environment not found. Please run 'setup-dev.bat' first.
    pause
    exit /b 1
)

REM Activate venv (so uvicorn is found)
call server\venv\Scripts\activate

REM Start both servers using pnpm run dev (concurrently)
echo Starting Backend (FastAPI) and Frontend (Vite)...
pnpm dev
