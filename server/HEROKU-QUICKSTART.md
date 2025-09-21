# 🚀 Quick Start: Deploy Sweet Shop Backend to Heroku

## One-Command Deployment

### Windows:
```cmd
cd server
deploy-heroku.bat
```

### Linux/Mac:
```bash
cd server
chmod +x deploy-heroku.sh
./deploy-heroku.sh
```

## Manual Deployment (5 Steps)

### 1. Prerequisites
- Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- Navigate to `server/` directory

### 2. Login & Create App
```bash
heroku login
heroku create your-app-name
```

### 3. Add Database
```bash
heroku addons:create heroku-postgresql:mini
```

### 4. Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key
heroku config:set JWT_EXPIRES_IN=7d
heroku config:set BCRYPT_ROUNDS=12
```

### 5. Deploy
```bash
git init
git add .
git commit -m "Deploy to Heroku"
heroku git:remote -a your-app-name
git push heroku main
```

## What Gets Created

✅ **Heroku App** with your backend  
✅ **PostgreSQL Database** (free tier)  
✅ **Environment Variables** configured  
✅ **SSL Certificate** (automatic)  
✅ **Custom Domain** (your-app-name.herokuapp.com)  

## Update Your Frontend

After deployment, update your frontend environment:

```bash
# .env.production
VITE_API_URL=https://your-app-name.herokuapp.com
```

## Testing Your Deployment

```bash
# Health check
curl https://your-app-name.herokuapp.com/health

# Register test user
curl -X POST https://your-app-name.herokuapp.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Useful Commands

```bash
heroku logs --tail              # View real-time logs
heroku ps                       # Check app status
heroku config                   # View environment variables
heroku pg:info                  # Database information
heroku open                     # Open app in browser
```

## Troubleshooting

**Build fails?**
```bash
heroku logs --tail
```

**App won't start?**
```bash
heroku ps
heroku restart
```

**Database issues?**
```bash
heroku pg:info
heroku config | grep DATABASE
```

## Cost

- **Free Tier**: 0-550 hours/month
- **Hobby Tier**: $7/month (recommended for production)
- **PostgreSQL**: Free up to 10,000 rows

---

📖 **Need more details?** See [HEROKU-DEPLOYMENT.md](./HEROKU-DEPLOYMENT.md) for comprehensive guide.

🎉 **That's it!** Your Sweet Shop backend is now live on Heroku!
