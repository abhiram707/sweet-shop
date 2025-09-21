@echo off
echo 🍬 Sweet Shop Management System - Deployment Helper
echo ==================================================

echo.
echo 📋 BACKEND DEPLOYMENT FILES:
echo ├── server/ (entire directory)
echo │   ├── package.json ✅
echo │   ├── tsconfig.json ✅
echo │   ├── README.md ✅
echo │   ├── Dockerfile ✅
echo │   ├── .env.production ✅
echo │   ├── .gitignore ✅
echo │   └── [all source files] ✅
echo └── database.sqlite ✅ (if deploying with data)

echo.
echo 🌐 FRONTEND DEPLOYMENT FILES:
echo ├── src/ ✅
echo ├── package.json (use frontend-package.json) ✅
echo ├── vite.config.ts ✅
echo ├── tailwind.config.js ✅
echo ├── postcss.config.js ✅
echo ├── tsconfig*.json ✅
echo ├── index.html ✅
echo ├── .env.production.local ✅
echo ├── nginx.conf ✅
echo ├── Dockerfile.frontend ✅
echo └── frontend-README.md ✅

echo.
echo 🚫 FILES TO EXCLUDE FROM BOTH:
echo ├── node_modules/ ❌
echo ├── .git/ ❌
echo ├── logs/ ❌
echo ├── coverage/ ❌
echo ├── .vscode/ ❌
echo └── .env (dev files) ❌

echo.
echo ⚙️ SETUP COMMANDS:
echo.
echo 🏗️ Backend Setup:
echo cd server/
echo npm install
echo copy .env.production .env
echo npm run build
echo npm start
echo.
echo 🎨 Frontend Setup:
echo copy frontend-package.json package.json
echo npm install
echo copy .env.production.local .env.local
echo npm run build
echo.

echo 📖 For detailed instructions, see DEPLOYMENT-GUIDE.md
echo.

set /p choice="Would you like to create deployment packages? (y/n): "
if /i "%choice%"=="y" (
    echo 📦 Creating deployment packages...
    
    REM Create backend package
    if not exist deploy-packages\backend mkdir deploy-packages\backend
    xcopy server\* deploy-packages\backend\ /E /I /Y
    copy database.sqlite deploy-packages\backend\ 2>nul
    
    REM Create frontend package
    if not exist deploy-packages\frontend mkdir deploy-packages\frontend
    xcopy src deploy-packages\frontend\src\ /E /I /Y
    copy frontend-package.json deploy-packages\frontend\package.json
    copy vite.config.ts deploy-packages\frontend\
    copy tailwind.config.js deploy-packages\frontend\
    copy postcss.config.js deploy-packages\frontend\
    copy tsconfig*.json deploy-packages\frontend\
    copy index.html deploy-packages\frontend\
    copy .env.production.local deploy-packages\frontend\
    copy nginx.conf deploy-packages\frontend\
    copy Dockerfile.frontend deploy-packages\frontend\
    copy frontend-README.md deploy-packages\frontend\README.md
    
    echo ✅ Deployment packages created in deploy-packages/
    echo 📁 deploy-packages\backend\ - Ready for backend deployment
    echo 📁 deploy-packages\frontend\ - Ready for frontend deployment
)

pause
