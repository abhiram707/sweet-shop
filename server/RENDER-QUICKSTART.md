# 🚀 Render Quick Start Guide

## Deploy in 5 Minutes

### 1. Run Deployment Script
```bash
# Windows
deploy-render.bat

# Linux/Mac  
./deploy-render.sh
```

### 2. Create Render Services

**Web Service:**
- Go to [render.com](https://render.com)
- New + → Web Service
- Connect your GitHub repo
- Settings:
  - Root Directory: `server`
  - Build: `npm install && npm run build`
  - Start: `npm start`

**Database:**
- New + → PostgreSQL
- Name: `sweet-shop-db`
- Copy Internal Database URL

### 3. Environment Variables
```
NODE_ENV=production
DATABASE_URL=<your-postgres-url>
JWT_SECRET=<random-32-chars>
```

### 4. Test
```bash
curl https://your-app.onrender.com/health
```

**✅ Done!** Your backend is live.

---

📖 **Full Guide**: See `RENDER-DEPLOYMENT.md` for detailed instructions.
