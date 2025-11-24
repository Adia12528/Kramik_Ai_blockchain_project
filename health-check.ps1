# Kramik System Health Check Script

Write-Host "`n🏥 Kramik System Health Check`n" -ForegroundColor Cyan

# Test 1: Check if backend is running
Write-Host "📡 Testing Backend Server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is running on port 5000" -ForegroundColor Green
        $content = $response.Content | ConvertFrom-Json
        Write-Host "   Service: $($content.service)" -ForegroundColor Gray
        Write-Host "   Version: $($content.version)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Backend is NOT running or not accessible" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n   💡 Solution: Start the backend server:" -ForegroundColor Yellow
    Write-Host "   cd 'c:\Users\adia1\OneDrive\Documents\AI websites\Kramik\kramik-hub\backend'" -ForegroundColor Gray
    Write-Host "   npm run dev" -ForegroundColor Gray
}

# Test 2: Check if blockchain auth endpoint exists
Write-Host "`n🔗 Testing Blockchain Auth Endpoint..." -ForegroundColor Yellow
try {
    # Try POST with dummy data to see if endpoint exists
    $body = @{
        message = "test"
        signature = "test"
        userType = "student"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/blockchain-login" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -TimeoutSec 5 -ErrorAction Stop
    
    Write-Host "✅ Blockchain auth endpoint is accessible" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "✅ Blockchain auth endpoint exists (returned 400 for test data)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Blockchain auth endpoint returned: $statusCode" -ForegroundColor Yellow
    }
}

# Test 3: Check for common port conflicts
Write-Host "`n🔌 Checking Port Usage..." -ForegroundColor Yellow
$ports = @(5000, 3000, 3001, 3002, 3003)
foreach ($port in $ports) {
    $connections = netstat -ano | Select-String ":$port "
    if ($connections) {
        Write-Host "   Port $port is in use" -ForegroundColor Green
    } else {
        Write-Host "   Port $port is free" -ForegroundColor Gray
    }
}

# Test 4: Check MongoDB connection string
Write-Host "`n📊 Checking MongoDB Configuration..." -ForegroundColor Yellow
$envPath = "c:\Users\adia1\OneDrive\Documents\AI websites\Kramik\kramik-hub\backend\.env"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath
    $mongoLine = $envContent | Select-String "MONGODB_URI"
    if ($mongoLine) {
        Write-Host "✅ MongoDB URI is configured in .env" -ForegroundColor Green
        if ($mongoLine -match "mongodb\+srv://") {
            Write-Host "   Using MongoDB Atlas (cloud)" -ForegroundColor Gray
        } else {
            Write-Host "   Using local MongoDB" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ MongoDB URI not found in .env" -ForegroundColor Red
    }
} else {
    Write-Host "❌ .env file not found at $envPath" -ForegroundColor Red
}

# Test 5: Check if required npm packages are installed
Write-Host "`n📦 Checking Dependencies..." -ForegroundColor Yellow
$backendPackageJson = "c:\Users\adia1\OneDrive\Documents\AI websites\Kramik\kramik-hub\backend\package.json"
$frontendPackageJson = "c:\Users\adia1\OneDrive\Documents\AI websites\Kramik\kramik-hub\frontend\package.json"

if (Test-Path $backendPackageJson) {
    $backendNodeModules = "c:\Users\adia1\OneDrive\Documents\AI websites\Kramik\kramik-hub\backend\node_modules"
    if (Test-Path $backendNodeModules) {
        Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend node_modules not found - run 'npm install' in backend folder" -ForegroundColor Red
    }
}

if (Test-Path $frontendPackageJson) {
    $frontendNodeModules = "c:\Users\adia1\OneDrive\Documents\AI websites\Kramik\kramik-hub\frontend\node_modules"
    if (Test-Path $frontendNodeModules) {
        Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend node_modules not found - run 'npm install' in frontend folder" -ForegroundColor Red
    }
}

# Summary
Write-Host "`n" -NoNewline
Write-Host "=" -ForegroundColor Cyan -NoNewline
for ($i = 0; $i -lt 50; $i++) { Write-Host "=" -ForegroundColor Cyan -NoNewline }
Write-Host ""
Write-Host "🎯 Health Check Complete!" -ForegroundColor Cyan
Write-Host "=" -ForegroundColor Cyan -NoNewline
for ($i = 0; $i -lt 50; $i++) { Write-Host "=" -ForegroundColor Cyan -NoNewline }
Write-Host "`n"

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. If backend is NOT running, use: .\start-dev.ps1" -ForegroundColor Gray
Write-Host "2. Open http://localhost:5000/health to verify backend" -ForegroundColor Gray
Write-Host "3. Check browser console (F12) when testing blockchain login" -ForegroundColor Gray
Write-Host "4. See BLOCKCHAIN_LOGIN_DEBUG.md for detailed troubleshooting`n" -ForegroundColor Gray

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
