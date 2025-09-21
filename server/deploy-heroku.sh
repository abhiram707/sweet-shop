#!/bin/bash

# Sweet Shop Backend - Heroku Deployment Script

echo "🚀 Sweet Shop Backend - Heroku Deployment"
echo "========================================"

# Check if we're in the server directory
if [ ! -f "package.json" ] || [ ! -f "Procfile" ]; then
    echo "❌ Error: Please run this script from the server/ directory"
    echo "Make sure you have package.json and Procfile in the current directory"
    exit 1
fi

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Error: Heroku CLI is not installed"
    echo "Please install it from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "🔐 Please login to Heroku:"
    heroku login
fi

# Get app name from user
read -p "Enter your Heroku app name (or press Enter to create a new one): " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo "🆕 Creating a new Heroku app..."
    APP_NAME=$(heroku create --json | grep -o '"name":"[^"]*' | cut -d'"' -f4)
    echo "✅ Created app: $APP_NAME"
else
    echo "📱 Using existing app: $APP_NAME"
fi

# Add PostgreSQL addon
echo "🗄️ Adding PostgreSQL database..."
heroku addons:create heroku-postgresql:mini --app $APP_NAME

# Set environment variables
echo "⚙️ Setting environment variables..."

# Generate a secure JWT secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

heroku config:set \
    NODE_ENV=production \
    JWT_SECRET=$JWT_SECRET \
    JWT_EXPIRES_IN=7d \
    BCRYPT_ROUNDS=12 \
    RATE_LIMIT_WINDOW_MS=900000 \
    RATE_LIMIT_MAX_REQUESTS=50 \
    --app $APP_NAME

echo "✅ Environment variables configured"

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for Sweet Shop backend"
fi

# Add Heroku remote
heroku git:remote -a $APP_NAME

echo "🚀 Deploying to Heroku..."
git push heroku main || git push heroku master

# Wait for deployment to complete
echo "⏳ Waiting for deployment to complete..."
sleep 10

# Test the deployment
APP_URL="https://$APP_NAME.herokuapp.com"
echo "🔍 Testing deployment..."

if curl -f "$APP_URL/health" &> /dev/null; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is available at: $APP_URL"
    echo "📊 Health check: $APP_URL/health"
    echo "📖 API Documentation: $APP_URL/api"
else
    echo "⚠️ Deployment completed but health check failed"
    echo "📋 Check logs with: heroku logs --tail --app $APP_NAME"
fi

echo ""
echo "🎉 Deployment Complete!"
echo "========================================"
echo "App Name: $APP_NAME"
echo "App URL: $APP_URL"
echo "Database: PostgreSQL (added)"
echo ""
echo "📋 Next Steps:"
echo "1. Update your frontend VITE_API_URL to: $APP_URL"
echo "2. Test your API endpoints"
echo "3. Monitor with: heroku logs --tail --app $APP_NAME"
echo "4. View app info: heroku info --app $APP_NAME"
echo ""
echo "🔧 Useful Commands:"
echo "heroku logs --tail --app $APP_NAME    # View logs"
echo "heroku ps --app $APP_NAME             # View app status"
echo "heroku config --app $APP_NAME         # View env vars"
echo "heroku pg:info --app $APP_NAME        # Database info"
