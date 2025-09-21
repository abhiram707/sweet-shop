@echo off
setlocal enabledelayedexpansion

REM Sweet Shop Backend - Render Deployment Script (Windows)
REM This script helps deploy your backend to Render automatically

echo.
echo 🍭 Sweet Shop Backend - Render Deployment 🍭
echo =============================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo [INFO] Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
) else (
    echo [INFO] Git repository already exists
    
    REM Check for uncommitted changes and commit
    git add .
    git commit -m "Update for Render deployment" 2>nul || echo [WARNING] Nothing to commit
)

REM Check if remote origin exists
git remote | findstr "origin" >nul
if errorlevel 1 (
    echo [WARNING] No git remote found. Please add your GitHub repository:
    echo   1. Create a new repository on GitHub
    echo   2. Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
    echo   3. Run: git push -u origin main
    echo.
    set /p repo_url="Enter your GitHub repository URL: "
    if not "!repo_url!"=="" (
        git remote add origin "!repo_url!"
        echo [SUCCESS] Added remote origin: !repo_url!
    )
)

REM Push to GitHub
echo [INFO] Pushing to GitHub...
git push origin main 2>nul || git push origin master 2>nul

if %errorlevel% equ 0 (
    echo [SUCCESS] Code pushed to GitHub successfully!
) else (
    echo [ERROR] Failed to push to GitHub. Please check your remote configuration.
)

echo.
echo 🚀 Next Steps for Render Deployment:
echo ====================================
echo 1. Go to https://render.com and sign up/login
echo 2. Click 'New +' and select 'Web Service'
echo 3. Connect your GitHub repository
echo 4. Configure the service with these settings:
echo.
echo    📋 Configuration:
echo    ---------------
echo    Name: sweet-shop-backend
echo    Environment: Node
echo    Region: Choose your preferred region
echo    Branch: main (or master)
echo    Root Directory: server
echo    Build Command: npm install ^&^& npm run build
echo    Start Command: npm start
echo.
echo    🔧 Environment Variables:
echo    ------------------------
echo    NODE_ENV=production
echo    PORT=10000 (Render will override this)
echo    JWT_SECRET=^<generate-random-string^>
echo    DATABASE_URL=^<render-postgresql-url^>
echo.
echo 5. Add PostgreSQL Database:
echo    - Go to Render Dashboard
echo    - Click 'New +' → 'PostgreSQL'
echo    - Name: sweet-shop-db
echo    - Copy the 'Internal Database URL'
echo    - Add it as DATABASE_URL environment variable to your web service
echo.
echo 6. Deploy your service!
echo.

REM Generate JWT secret
for /f %%i in ('powershell -command "[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))"') do set jwt_secret=%%i
echo [SUCCESS] Generated JWT Secret (copy this): !jwt_secret!

echo.
echo [INFO] 🔗 Useful Links:
echo    - Render Dashboard: https://dashboard.render.com
echo    - Render Docs: https://render.com/docs
echo    - PostgreSQL Setup: https://render.com/docs/databases
echo.

echo [SUCCESS] ✅ Render deployment preparation complete!
echo [WARNING] Don't forget to update your frontend's API URL to point to your Render backend URL!

pause
