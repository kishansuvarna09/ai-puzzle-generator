@echo off
echo ==========================================
echo   Setting up Development Environment...
echo ==========================================

REM 1. Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 22+.
    pause
    exit /b 1
)

REM 2. Check for Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install Python 3.9+.
    pause
    exit /b 1
)

REM 3. Setup Backend (Virtual Environment)
echo.
echo [1/4] Setting up Backend (Python venv)...
if not exist "server\venv" (
    echo Creating virtual environment...
    cd server
    python -m venv venv
    cd ..
) else (
    echo Virtual environment already exists.
)

echo Activating venv and installing requirements...
call server\venv\Scripts\activate
pip install -r server\requirements.txt

REM 4. Setup Frontend
echo.
echo [2/4] Setting up Frontend...
cd client
if not exist "node_modules" (
    echo Installing client dependencies...
    call pnpm install
) else (
    echo Client dependencies already installed.
)
cd ..

REM 5. Setup Root
echo.
echo [3/4] Setting up Root scripts...
if not exist "node_modules" (
    call pnpm install
)

echo.
echo ==========================================
echo   Setup Complete!
echo   Run 'start-dev.bat' to start the app.
echo ==========================================
pause
