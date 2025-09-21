#!/bin/bash

# Sweet Shop Deployment Helper Script
# This script helps you understand what files to deploy for backend vs frontend

echo "🍬 Sweet Shop Management System - Deployment Helper"
echo "=================================================="

echo ""
echo "📋 BACKEND DEPLOYMENT FILES:"
echo "├── server/ (entire directory)"
echo "│   ├── package.json ✅"
echo "│   ├── tsconfig.json ✅" 
echo "│   ├── README.md ✅"
echo "│   ├── Dockerfile ✅"
echo "│   ├── .env.production ✅"
echo "│   ├── .gitignore ✅"
echo "│   └── [all source files] ✅"
echo "└── database.sqlite ✅ (if deploying with data)"

echo ""
echo "🌐 FRONTEND DEPLOYMENT FILES:"
echo "├── src/ ✅"
echo "├── package.json (use frontend-package.json) ✅"
echo "├── vite.config.ts ✅"
echo "├── tailwind.config.js ✅"
echo "├── postcss.config.js ✅"
echo "├── tsconfig*.json ✅"
echo "├── index.html ✅"
echo "├── .env.production.local ✅"
echo "├── nginx.conf ✅"
echo "├── Dockerfile.frontend ✅"
echo "└── frontend-README.md ✅"

echo ""
echo "🚫 FILES TO EXCLUDE FROM BOTH:"
echo "├── node_modules/ ❌"
echo "├── .git/ ❌"
echo "├── logs/ ❌"
echo "├── coverage/ ❌"
echo "├── .vscode/ ❌"
echo "└── .env (dev files) ❌"

echo ""
echo "⚙️ SETUP COMMANDS:"
echo ""
echo "🏗️ Backend Setup:"
echo "cd server/"
echo "npm install"
echo "cp .env.production .env"
echo "npm run build"
echo "npm start"
echo ""
echo "🎨 Frontend Setup:"
echo "cp frontend-package.json package.json"
echo "npm install"
echo "cp .env.production.local .env.local"
echo "npm run build"
echo ""

echo "🚀 QUICK DEPLOYMENT:"
echo "Backend: ./deploy-backend.sh"
echo "Frontend: ./deploy-frontend.sh"
echo ""

echo "📖 For detailed instructions, see DEPLOYMENT-GUIDE.md"
echo ""

# Check if user wants to create deployment packages
read -p "Would you like to create deployment packages? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 Creating deployment packages..."
    
    # Create backend package
    mkdir -p deploy-packages/backend
    cp -r server/* deploy-packages/backend/
    cp database.sqlite deploy-packages/backend/ 2>/dev/null || echo "No database.sqlite found"
    
    # Create frontend package  
    mkdir -p deploy-packages/frontend
    cp -r src deploy-packages/frontend/
    cp frontend-package.json deploy-packages/frontend/package.json
    cp vite.config.ts deploy-packages/frontend/
    cp tailwind.config.js deploy-packages/frontend/
    cp postcss.config.js deploy-packages/frontend/
    cp tsconfig*.json deploy-packages/frontend/
    cp index.html deploy-packages/frontend/
    cp .env.production.local deploy-packages/frontend/
    cp nginx.conf deploy-packages/frontend/
    cp Dockerfile.frontend deploy-packages/frontend/
    cp frontend-README.md deploy-packages/frontend/README.md
    
    echo "✅ Deployment packages created in deploy-packages/"
    echo "📁 deploy-packages/backend/ - Ready for backend deployment"
    echo "📁 deploy-packages/frontend/ - Ready for frontend deployment"
fi
