# Sweet Shop Management System - Deployment Guide

This guide covers deploying the frontend and backend separately for production.

## 🏗️ Project Structure for Deployment

```
project/
├── server/                 # Backend (Node.js/Express)
│   ├── package.json       # Backend dependencies
│   ├── tsconfig.json      # Backend TypeScript config
│   ├── Dockerfile         # Backend Docker image
│   ├── .env               # Backend environment (dev)
│   ├── .env.production    # Backend environment (prod)
│   └── ...                # Backend source code
├── src/                   # Frontend (React)
├── package.json           # Frontend dependencies (root)
├── vite.config.ts         # Frontend build config
├── Dockerfile.frontend    # Frontend Docker image
├── nginx.conf             # Frontend nginx config
├── .env.local             # Frontend environment (dev)
├── .env.production.local  # Frontend environment (prod)
└── deploy-*.sh            # Deployment scripts
```

## 🚀 Backend Deployment

### Prerequisites
- Node.js 18+
- PM2 (recommended) or Docker

### Option 1: Traditional VPS/Server Deployment

1. **Prepare the server**
   ```bash
   # Copy only backend files
   scp -r server/ user@your-server:/opt/sweet-shop-backend/
   ```

2. **Install dependencies**
   ```bash
   cd /opt/sweet-shop-backend
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.production .env
   # Edit .env with your production values
   ```

4. **Build and start**
   ```bash
   npm run build
   npm start
   # OR with PM2
   pm2 start dist/index.js --name sweet-shop-backend
   ```

### Option 2: Docker Deployment

1. **Build image**
   ```bash
   cd server/
   docker build -t sweet-shop-backend .
   ```

2. **Run container**
   ```bash
   docker run -d \
     --name sweet-shop-backend \
     -p 3003:3003 \
     -v $(pwd)/database.sqlite:/app/database.sqlite \
     -e NODE_ENV=production \
     sweet-shop-backend
   ```

### Option 3: Cloud Platforms

#### Railway
1. Connect your GitHub repository
2. Set root directory to `server/`
3. Set environment variables
4. Deploy automatically

#### Heroku
1. Create a new app
2. Set buildpack to Node.js
3. Configure environment variables
4. Deploy from `server/` directory

#### DigitalOcean App Platform
1. Create new app from GitHub
2. Set source directory to `server/`
3. Configure environment variables
4. Deploy

## 🌐 Frontend Deployment

### Prerequisites
- Node.js 18+ (for building)
- Static hosting service or nginx

### Option 1: Static Hosting (Recommended)

#### Netlify
1. **Build locally**
   ```bash
   npm run build
   ```

2. **Deploy**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   netlify deploy --prod --dir dist
   ```

3. **Configure redirects** (create `public/_redirects`)
   ```
   /*    /index.html   200
   ```

#### Vercel
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   npm run build
   vercel --prod
   ```

#### GitHub Pages
1. **Build and deploy**
   ```bash
   npm run build
   # Push dist/ folder to gh-pages branch
   ```

### Option 2: Docker with Nginx

1. **Build image**
   ```bash
   docker build -f Dockerfile.frontend -t sweet-shop-frontend .
   ```

2. **Run container**
   ```bash
   docker run -d \
     --name sweet-shop-frontend \
     -p 80:80 \
     sweet-shop-frontend
   ```

### Option 3: Traditional Web Server

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Copy files to web server**
   ```bash
   sudo cp -r dist/* /var/www/html/
   ```

3. **Configure nginx** (`/etc/nginx/sites-available/sweet-shop`)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## ⚙️ Environment Configuration

### Backend Environment Variables
```bash
NODE_ENV=production
PORT=3003
JWT_SECRET=your-production-jwt-secret-change-this
JWT_EXPIRES_IN=7d
DATABASE_URL=./database.sqlite
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50
```

### Frontend Environment Variables
```bash
VITE_API_URL=https://your-backend-domain.com
VITE_APP_NAME=Sweet Shop Management System
VITE_NODE_ENV=production
```

## 🔧 Configuration Updates

### Update API URL in Frontend
Make sure your frontend points to the correct backend URL:

1. **Update `.env.production.local`**
   ```bash
   VITE_API_URL=https://your-backend-domain.com
   ```

2. **For build-time configuration**
   ```bash
   VITE_API_URL=https://api.sweetshop.com npm run build
   ```

### CORS Configuration in Backend
Update CORS settings in `server/index.ts`:
```typescript
app.use(cors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true
}));
```

## 🚦 Health Checks and Monitoring

### Backend Health Check
```bash
curl https://your-backend-domain.com/health
```

### Frontend Health Check
```bash
curl https://your-frontend-domain.com/health
```

### Monitoring with PM2
```bash
pm2 monit
pm2 logs sweet-shop-backend
```

## 🔐 Security Considerations

1. **Environment Variables**: Never commit production secrets
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS properly for your domains
4. **Rate Limiting**: Adjust rate limits for production load
5. **Database**: Regular backups of SQLite database
6. **Nginx**: Configure security headers

## 📦 Files to Include/Exclude for Deployment

### Backend Deployment Files
```
server/
├── package.json ✅
├── tsconfig.json ✅
├── src/ ✅
├── dist/ ✅ (after build)
├── database.sqlite ✅
├── .env.production ✅
├── README.md ✅
└── Dockerfile ✅
```

### Frontend Deployment Files
```
├── src/ ✅
├── public/ ✅ (if exists)
├── package.json ✅
├── vite.config.ts ✅
├── tailwind.config.js ✅
├── postcss.config.js ✅
├── tsconfig*.json ✅
├── index.html ✅
├── .env.production.local ✅
├── nginx.conf ✅
└── Dockerfile.frontend ✅
```

### Files to Exclude
- `node_modules/` ❌
- `.git/` ❌
- `logs/` ❌
- `.env` (dev environment) ❌
- `coverage/` ❌
- `.vscode/` ❌

## 🚀 Quick Deployment Commands

### Deploy Backend to VPS
```bash
./deploy-backend.sh
```

### Deploy Frontend to Static Hosting
```bash
./deploy-frontend.sh
```

### Deploy Both with Docker Compose
```bash
docker-compose -f docker-compose.production.yml up -d
```

This guide ensures your Sweet Shop Management System can be deployed separately with proper security and performance configurations.
