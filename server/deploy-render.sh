#!/bin/bash

# Sweet Shop Backend - Render Deployment Script
# This script helps deploy your backend to Render automatically

set -e  # Exit on any error

echo "🍭 Sweet Shop Backend - Render Deployment 🍭"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_status "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
else
    print_status "Git repository already exists"
    
    # Check for uncommitted changes
    if ! git diff --quiet || ! git diff --cached --quiet; then
        print_status "Committing latest changes..."
        git add .
        git commit -m "Update for Render deployment" || print_warning "Nothing to commit"
    fi
fi

# Check if remote origin exists
if ! git remote | grep -q "origin"; then
    print_warning "No git remote found. Please add your GitHub repository:"
    echo "  1. Create a new repository on GitHub"
    echo "  2. Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo "  3. Run: git push -u origin main"
    echo ""
    read -p "Enter your GitHub repository URL: " repo_url
    if [ ! -z "$repo_url" ]; then
        git remote add origin "$repo_url"
        print_success "Added remote origin: $repo_url"
    fi
fi

# Push to GitHub
print_status "Pushing to GitHub..."
git push origin main || git push origin master

print_success "Code pushed to GitHub successfully!"

echo ""
echo "🚀 Next Steps for Render Deployment:"
echo "===================================="
echo "1. Go to https://render.com and sign up/login"
echo "2. Click 'New +' and select 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Configure the service with these settings:"
echo ""
echo "   📋 Configuration:"
echo "   ---------------"
echo "   Name: sweet-shop-backend"
echo "   Environment: Node"
echo "   Region: Choose your preferred region"
echo "   Branch: main (or master)"
echo "   Root Directory: server"
echo "   Build Command: npm install && npm run build"
echo "   Start Command: npm start"
echo ""
echo "   🔧 Environment Variables:"
echo "   ------------------------"
echo "   NODE_ENV=production"
echo "   PORT=10000 (Render will override this)"
echo "   JWT_SECRET=$(openssl rand -base64 32)"
echo "   DATABASE_URL=(Render will provide PostgreSQL URL)"
echo ""
echo "5. Add PostgreSQL Database:"
echo "   - Go to Render Dashboard"
echo "   - Click 'New +' → 'PostgreSQL'"
echo "   - Name: sweet-shop-db"
echo "   - Copy the 'Internal Database URL'"
echo "   - Add it as DATABASE_URL environment variable to your web service"
echo ""
echo "6. Deploy your service!"
echo ""

# Generate JWT secret for easy copy-paste
jwt_secret=$(openssl rand -base64 32 2>/dev/null || echo "Please generate JWT secret manually")
print_success "Generated JWT Secret (copy this): $jwt_secret"

echo ""
print_status "🔗 Useful Links:"
echo "   - Render Dashboard: https://dashboard.render.com"
echo "   - Render Docs: https://render.com/docs"
echo "   - PostgreSQL Setup: https://render.com/docs/databases"
echo ""

print_success "✅ Render deployment preparation complete!"
print_warning "Don't forget to update your frontend's API URL to point to your Render backend URL!"
