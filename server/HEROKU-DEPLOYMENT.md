# Sweet Shop Backend - Heroku Deployment Guide

This guide will walk you through deploying the Sweet Shop Management System backend to Heroku.

## Prerequisites

- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- Git installed
- A Heroku account

## Step 1: Prepare Your Project

1. **Navigate to the server directory:**
   ```bash
   cd server/
   ```

2. **Initialize Git repository (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Sweet Shop backend"
   ```

## Step 2: Create Heroku Application

1. **Login to Heroku:**
   ```bash
   heroku login
   ```

2. **Create a new Heroku app:**
   ```bash
   heroku create your-sweet-shop-backend
   # Replace 'your-sweet-shop-backend' with your preferred app name
   ```

3. **Add PostgreSQL database:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

## Step 3: Configure Environment Variables

Set the required environment variables on Heroku:

```bash
# Required environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
heroku config:set JWT_EXPIRES_IN=7d
heroku config:set BCRYPT_ROUNDS=12
heroku config:set RATE_LIMIT_WINDOW_MS=900000
heroku config:set RATE_LIMIT_MAX_REQUESTS=50

# Optional: Custom port (Heroku sets this automatically)
# heroku config:set PORT=3003
```

**Important Security Note:** 
- Generate a strong JWT secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- Never use the example JWT secret in production

## Step 4: Deploy to Heroku

1. **Deploy your application:**
   ```bash
   git push heroku main
   # or if your main branch is named differently:
   # git push heroku master
   ```

2. **Monitor the deployment:**
   ```bash
   heroku logs --tail
   ```

## Step 5: Initialize Database

Your PostgreSQL database will be automatically provisioned, but you may need to verify the connection:

```bash
# Check database info
heroku pg:info

# Access database (optional)
heroku pg:psql
```

## Step 6: Test Your Deployment

1. **Get your app URL:**
   ```bash
   heroku open
   # or
   heroku info
   ```

2. **Test the health endpoint:**
   ```bash
   curl https://your-sweet-shop-backend.herokuapp.com/health
   ```

3. **Test the API:**
   ```bash
   # Register a new user
   curl -X POST https://your-sweet-shop-backend.herokuapp.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

## Step 7: Configure Frontend

Update your frontend environment variables to point to your Heroku backend:

```bash
# In your frontend .env.production file:
VITE_API_URL=https://your-sweet-shop-backend.herokuapp.com
```

## Troubleshooting

### Common Issues:

1. **Build Failures:**
   ```bash
   # Check build logs
   heroku logs --tail
   
   # Restart the app
   heroku restart
   ```

2. **Database Connection Issues:**
   ```bash
   # Check database connection
   heroku pg:info
   
   # Reset database (CAUTION: This will delete all data)
   heroku pg:reset DATABASE_URL
   ```

3. **Environment Variables:**
   ```bash
   # Check all config vars
   heroku config
   
   # Remove a config var
   heroku config:unset VARIABLE_NAME
   ```

4. **Application Logs:**
   ```bash
   # View recent logs
   heroku logs
   
   # View real-time logs
   heroku logs --tail
   
   # View logs for specific process
   heroku logs --ps web
   ```

### Performance Optimization:

1. **Scale your app:**
   ```bash
   # Scale to multiple dynos (requires paid plan)
   heroku ps:scale web=2
   
   # Check current scale
   heroku ps
   ```

2. **Enable HTTP/2:**
   Your app automatically supports HTTP/2 on Heroku.

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `production` |
| `PORT` | Server port | No* | `3003` |
| `JWT_SECRET` | JWT signing secret | Yes | `your-64-char-secret` |
| `JWT_EXPIRES_IN` | JWT expiration | Yes | `7d` |
| `DATABASE_URL` | PostgreSQL URL | No* | Set by Heroku |
| `BCRYPT_ROUNDS` | Password hashing rounds | Yes | `12` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | Yes | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | Yes | `50` |

*Automatically set by Heroku

## Scaling and Monitoring

### Monitoring:
```bash
# View app metrics
heroku metrics

# View database metrics
heroku pg:info
```

### Scaling:
```bash
# Upgrade to hobby dyno (paid)
heroku ps:type hobby

# Add more dynos (paid)
heroku ps:scale web=2
```

## Security Checklist

- ✅ Strong JWT secret configured
- ✅ Environment variables set properly
- ✅ Database connection secured with SSL
- ✅ Rate limiting configured
- ✅ CORS configured for your frontend domain
- ✅ Helmet security headers enabled

## Continuous Deployment

To set up automatic deployment from GitHub:

1. Connect your GitHub repository in the Heroku dashboard
2. Enable automatic deploys from your main branch
3. Optionally enable review apps for pull requests

## Backup and Recovery

```bash
# Create database backup
heroku pg:backups:capture

# List backups
heroku pg:backups

# Download backup
heroku pg:backups:download
```

## Cost Optimization

- Use the free tier for development/testing
- Upgrade to Hobby tier ($7/month) for production
- Monitor your usage in the Heroku dashboard
- Consider using Heroku Scheduler for maintenance tasks

## Support

If you encounter issues:

1. Check the [Heroku Dev Center](https://devcenter.heroku.com/)
2. Review application logs: `heroku logs --tail`
3. Check the [Sweet Shop documentation](./README.md)

## Next Steps

After successful deployment:

1. Set up monitoring with Heroku metrics or external services
2. Configure your frontend to use the Heroku backend URL
3. Set up continuous deployment from GitHub
4. Consider adding additional add-ons (Redis, monitoring, etc.)

---

🎉 **Congratulations!** Your Sweet Shop backend is now deployed to Heroku and ready to serve your users!
