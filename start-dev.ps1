# Kramik Development Server Startup Script
Write-Host "🚀 Starting Kramik Development Environment..." -ForegroundColor Cyan

# Start Backend Server
Write-Host "`n📡 Starting Backend Server on http://localhost:5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\adia1\OneDrive\Documents\AI websites\Kramik\kramik-hub\backend'; npm run dev"

# Wait a few seconds for backend to initialize
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "`n🎨 Starting Frontend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\adia1\OneDrive\Documents\AI websites\Kramik\kramik-hub\frontend'; npm run dev"

Write-Host "`n✅ Development servers starting!" -ForegroundColor Green
Write-Host "📡 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🎨 Frontend: Check the second terminal for the URL" -ForegroundColor Cyan
Write-Host "`nℹ️  Two PowerShell windows will open - one for backend, one for frontend" -ForegroundColor Yellow
Write-Host "ℹ️  Keep both windows open while developing" -ForegroundColor Yellow
Write-Host "`nPress any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
