# TouchGrass AI - Local Development Runner
# Launches FastAPI Backend (Port 8000) and Vite React Frontend (Port 5173)

Write-Host "==========================================" -ForegroundColor Green
Write-Host "        🌱 TouchGrass AI Launcher         " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# 1. Check Ollama
$ollamaCheck = Get-Command ollama -ErrorAction SilentlyContinue
if (-not $ollamaCheck) {
    Write-Host "[!] Note: Ollama is not detected in your PATH." -ForegroundColor Yellow
    Write-Host "    Install via: winget install Ollama.Ollama" -ForegroundColor Yellow
    Write-Host "    Or download from: https://ollama.com/download" -ForegroundColor Yellow
    Write-Host "    Then run: ollama run gemma2:2b" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "[✓] Ollama is installed." -ForegroundColor Cyan
}

# 2. Start Backend
Write-Host "[*] Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Cyan
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\uvicorn.exe main:app --reload --host 127.0.0.1 --port 8000" -PassThru

# 3. Start Frontend
Write-Host "[*] Starting React Vite Frontend on http://127.0.0.1:5173..." -ForegroundColor Cyan
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -PassThru

Write-Host ""
Write-Host "[✓] TouchGrass AI is launching!" -ForegroundColor Green
Write-Host "    Frontend: http://127.0.0.1:5173" -ForegroundColor White
Write-Host "    Backend:  http://127.0.0.1:8000" -ForegroundColor White
Write-Host "    Backend Docs: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Press any key in this window when you wish to exit launcher."
