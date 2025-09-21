# 🚀 Render Deployment Guide - Sweet Shop Backend

This guide will help you deploy your Sweet Shop backend to Render, a modern cloud platform that makes deployment simple and reliable.

## 📋 Prerequisites

- GitHub account
- Render account (free tier available at [render.com](https://render.com))
- Git installed on your local machine
- Your backend code ready for deployment

## 🔧 Quick Deployment

### Option 1: Automated Script (Recommended)

**For Windows:**
```cmd
cd server
deploy-render.bat
```

**For Linux/Mac:**
```bash
cd server
chmod +x deploy-render.sh
./deploy-render.sh
```

### Option 2: Manual Deployment

Follow the step-by-step instructions below.

---

## 📝 Step-by-Step Manual Deployment

### 1. Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Render deployment"
   ```

2. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it something like `sweet-shop-backend`
   - Don't initialize with README (your local repo already has files)

3. **Connect and Push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/sweet-shop-backend.git
   git branch -M main
   git push -u origin main
   ```

### 2. Create Render Web Service

1. **Sign up/Login to Render**:
   - Go to [render.com](https://render.com)
   - Sign up for a free account or login

2. **Create New Web Service**:
   - Click **"New +"** button
   - Select **"Web Service"**
   - Choose **"Build and deploy from a Git repository"**
   - Click **"Connect account"** to connect your GitHub

3. **Configure Repository**:
   - Select your `sweet-shop-backend` repository
   - Click **"Connect"**

### 3. Configure Service Settings

Use these exact settings:

| Setting | Value |
|---------|-------|
| **Name** | `sweet-shop-backend` |
| **Environment** | `Node` |
| **Region** | Choose closest to your users |
| **Branch** | `main` (or `master`) |
| **Root Directory** | `server` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

### 4. Set Up PostgreSQL Database

1. **Create Database**:
   - In Render dashboard, click **"New +"**
   - Select **"PostgreSQL"**
   - Configure:
     - **Name**: `sweet-shop-db`
     - **Database Name**: `sweetshop`
     - **User**: `sweetshop_user`
     - **Region**: Same as your web service
   - Click **"Create Database"**

2. **Get Database URL**:
   - After creation, go to your database dashboard
   - Copy the **"Internal Database URL"**
   - It looks like: `postgresql://user:password@host:port/database`

### 5. Configure Environment Variables

In your web service settings, add these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Sets production mode |
| `DATABASE_URL` | `<your-postgres-url>` | PostgreSQL connection string |
| `JWT_SECRET` | `<random-32-char-string>` | JWT signing secret |
| `CORS_ORIGIN` | `https://your-frontend-url.onrender.com` | Your frontend URL |

**Generate JWT Secret:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

### 6. Deploy Your Service

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build your application
   - Start the service

3. **Monitor Deployment**:
   - Watch the logs in real-time
   - First deployment takes 5-10 minutes
   - Service will be available at `https://your-service-name.onrender.com`

---

## 🔍 Verification

### Test Your Deployment

1. **Health Check**:
   ```bash
   curl https://your-service-name.onrender.com/health
   ```
   Should return: `{"status": "OK", "timestamp": "..."}`

2. **API Endpoints**:
   - `GET /api/health` - Health check
   - `POST /api/auth/register` - User registration
   - `POST /api/auth/login` - User login
   - `GET /api/sweets` - Get all sweets

3. **Database Connection**:
   - Check logs for "Database initialized successfully"
   - No connection errors in the logs

---

## 🔧 Configuration Details

### Package.json Scripts

Your `package.json` includes these Render-specific scripts:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "render-postbuild": "npm run build"
  }
}
```

### Database Configuration

The app automatically detects Render environment:
```typescript
const isProduction = !!process.env.DATABASE_URL && 
  (process.env.DATABASE_URL.includes('postgres') || 
   process.env.RENDER_SERVICE_ID || 
   process.env.NODE_ENV === 'production');
```

### Environment Detection

- **Local Development**: Uses SQLite database
- **Render Production**: Uses PostgreSQL database
- **Automatic Switching**: No code changes needed

---

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check if `typescript` is in dependencies or devDependencies
   - Ensure `tsconfig.json` is present in server directory
   - Check build logs for specific errors

2. **Database Connection Errors**:
   - Verify `DATABASE_URL` is correctly set
   - Ensure PostgreSQL service is running
   - Check database URL format

3. **Port Issues**:
   - Render automatically sets PORT environment variable
   - Your app should use `process.env.PORT || 3001`

4. **CORS Errors**:
   - Set `CORS_ORIGIN` to your frontend URL
   - Update frontend API calls to use Render backend URL

### Debug Commands

**View Logs**:
```bash
# In Render dashboard, go to your service → Logs tab
```

**Test Database**:
```bash
# Connect to your PostgreSQL database using the External Database URL
psql "your-external-database-url"
```

---

## 🔄 Updates and Redeploys

### Automatic Deployments

Render automatically redeploys when you push to your connected branch:

```bash
git add .
git commit -m "Update backend features"
git push origin main
```

### Manual Redeploy

1. Go to your service in Render dashboard
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**

---

## 💰 Pricing

- **Free Tier**: 
  - 750 hours/month of runtime
  - Apps sleep after 15 minutes of inactivity
  - Perfect for development and testing

- **Paid Tiers**: 
  - Always-on services
  - Custom domains
  - Better performance

---

## 🔗 Useful Links

- **Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)
- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Node.js Guide**: [render.com/docs/node-js](https://render.com/docs/node-js)
- **PostgreSQL Guide**: [render.com/docs/databases](https://render.com/docs/databases)
- **Environment Variables**: [render.com/docs/environment-variables](https://render.com/docs/environment-variables)

---

## ✅ Success Checklist

- [ ] GitHub repository created and pushed
- [ ] Render web service created
- [ ] PostgreSQL database created
- [ ] Environment variables configured
- [ ] Service deployed successfully
- [ ] Health endpoint returns 200 OK
- [ ] Database connection working
- [ ] API endpoints accessible
- [ ] Frontend updated with new backend URL

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Render logs for error messages
3. Consult [Render's documentation](https://render.com/docs)
4. Check [Render's community forum](https://community.render.com)

---

**🎉 Congratulations! Your Sweet Shop backend is now running on Render!**

Remember to update your frontend application to use the new Render backend URL instead of localhost.
