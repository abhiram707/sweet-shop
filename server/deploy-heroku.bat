@echo off
echo 🚀 Sweet Shop Backend - Heroku Deployment
echo ========================================

REM Check if we're in the server directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the server/ directory
    echo Make sure you have package.json and Procfile in the current directory
    pause
    exit /b 1
)

if not exist "Procfile" (
    echo ❌ Error: Procfile not found in current directory
    pause
    exit /b 1
)

REM Check if Heroku CLI is installed
heroku --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Heroku CLI is not installed
    echo Please install it from: https://devcenter.heroku.com/articles/heroku-cli
    pause
    exit /b 1
)

REM Check if user is logged in to Heroku
heroku auth:whoami >nul 2>&1
if errorlevel 1 (
    echo 🔐 Please login to Heroku:
    heroku login
)

REM Get app name from user
set /p APP_NAME="Enter your Heroku app name (or press Enter to create a new one): "

if "%APP_NAME%"=="" (
    echo 🆕 Creating a new Heroku app...
    for /f "tokens=*" %%i in ('heroku create --json ^| findstr "name"') do set APP_RESPONSE=%%i
    REM Extract app name from JSON response (simplified)
    echo ✅ New app created! Check Heroku dashboard for the name.
    set /p APP_NAME="Please enter the app name from the dashboard: "
) else (
    echo 📱 Using existing app: %APP_NAME%
)

REM Add PostgreSQL addon
echo 🗄️ Adding PostgreSQL database...
heroku addons:create heroku-postgresql:mini --app %APP_NAME%

REM Set environment variables
echo ⚙️ Setting environment variables...

REM Generate a secure JWT secret (simplified for Windows)
set JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random-%RANDOM%-%RANDOM%

heroku config:set NODE_ENV=production --app %APP_NAME%
heroku config:set JWT_SECRET=%JWT_SECRET% --app %APP_NAME%
heroku config:set JWT_EXPIRES_IN=7d --app %APP_NAME%
heroku config:set BCRYPT_ROUNDS=12 --app %APP_NAME%
heroku config:set RATE_LIMIT_WINDOW_MS=900000 --app %APP_NAME%
heroku config:set RATE_LIMIT_MAX_REQUESTS=50 --app %APP_NAME%

echo ✅ Environment variables configured

REM Initialize git if not already done
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit for Sweet Shop backend"
)

REM Add Heroku remote
heroku git:remote -a %APP_NAME%

echo 🚀 Deploying to Heroku...
git push heroku main
if errorlevel 1 (
    git push heroku master
)

REM Wait for deployment to complete
echo ⏳ Waiting for deployment to complete...
timeout /t 10 /nobreak >nul

REM Test the deployment
set APP_URL=https://%APP_NAME%.herokuapp.com
echo 🔍 Testing deployment...

curl -f "%APP_URL%/health" >nul 2>&1
if errorlevel 1 (
    echo ⚠️ Deployment completed but health check failed
    echo 📋 Check logs with: heroku logs --tail --app %APP_NAME%
) else (
    echo ✅ Deployment successful!
    echo 🌐 Your app is available at: %APP_URL%
    echo 📊 Health check: %APP_URL%/health
    echo 📖 API Documentation: %APP_URL%/api
)

echo.
echo 🎉 Deployment Complete!
echo ========================================
echo App Name: %APP_NAME%
echo App URL: %APP_URL%
echo Database: PostgreSQL (added)
echo.
echo 📋 Next Steps:
echo 1. Update your frontend VITE_API_URL to: %APP_URL%
echo 2. Test your API endpoints
echo 3. Monitor with: heroku logs --tail --app %APP_NAME%
echo 4. View app info: heroku info --app %APP_NAME%
echo.
echo 🔧 Useful Commands:
echo heroku logs --tail --app %APP_NAME%    # View logs
echo heroku ps --app %APP_NAME%             # View app status
echo heroku config --app %APP_NAME%         # View env vars
echo heroku pg:info --app %APP_NAME%        # Database info

pause
