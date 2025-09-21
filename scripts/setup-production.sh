#!/bin/bash

# Production environment setup script
# Creates necessary directories, sets permissions, and configures environment

set -e

echo "🔧 Setting up production environment for Sweet Shop Management System..."

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p backups
mkdir -p uploads
mkdir -p tmp

# Set permissions (adjust as needed for your deployment)
echo "🔒 Setting permissions..."
chmod 755 scripts/*.sh
chmod 700 backups
chmod 755 logs

# Create log rotation configuration (for systemd deployments)
echo "📜 Setting up log rotation..."
cat > /tmp/sweetshop-logrotate << 'EOF'
/path/to/your/app/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 app app
    postrotate
        systemctl reload sweetshop || true
    endscript
}
EOF

echo "ℹ️ Log rotation config created at /tmp/sweetshop-logrotate"
echo "   Move to /etc/logrotate.d/sweetshop for system-wide log rotation"

# Create systemd service file template
echo "⚙️ Creating systemd service template..."
cat > /tmp/sweetshop.service << 'EOF'
[Unit]
Description=Sweet Shop Management System
Documentation=https://github.com/yourusername/sweet-shop-management
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=app
WorkingDirectory=/path/to/your/app
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server/dist/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=sweetshop

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/path/to/your/app/logs /path/to/your/app/uploads /path/to/your/app/tmp

[Install]
WantedBy=multi-user.target
EOF

echo "ℹ️ Systemd service template created at /tmp/sweetshop.service"
echo "   Customize paths and copy to /etc/systemd/system/ for system service"

# Create nginx configuration template
echo "🌐 Creating nginx configuration template..."
cat > /tmp/sweetshop-nginx.conf << 'EOF'
upstream sweetshop_backend {
    server 127.0.0.1:3001;
    keepalive 32;
}

server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Frontend static files
    location / {
        root /path/to/your/app/dist;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://sweetshop_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Rate limiting
        limit_req zone=api burst=10 nodelay;
    }
    
    # Health check
    location /health {
        proxy_pass http://sweetshop_backend;
        access_log off;
    }
}

# Rate limiting zone
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
EOF

echo "ℹ️ Nginx configuration template created at /tmp/sweetshop-nginx.conf"
echo "   Customize domains and paths, then copy to nginx sites-available"

# Create environment file template
echo "📋 Creating production environment template..."
cat > .env.production.template << 'EOF'
# Sweet Shop Management System - Production Configuration

# Application
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/sweetshop_production

# JWT
JWT_SECRET=your-super-secure-jwt-secret-here-change-this

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Redis (for session storage and caching)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://your-domain.com

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=9090

# Email (for notifications)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
SMTP_FROM=noreply@your-domain.com
EOF

echo "ℹ️ Production environment template created: .env.production.template"
echo "   Copy to .env.production and configure with your values"

# Create monitoring script
echo "📊 Creating monitoring script..."
cat > scripts/monitor.sh << 'EOF'
#!/bin/bash

# Simple monitoring script for Sweet Shop Management System

API_URL="http://localhost:3001"
LOG_FILE="logs/monitor.log"
ALERT_EMAIL="admin@your-domain.com"

# Function to log with timestamp
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Health check
health_status=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health" || echo "000")

if [ "$health_status" != "200" ]; then
    log_message "ALERT: Health check failed - Status: $health_status"
    echo "Sweet Shop Management System health check failed" | mail -s "System Alert" "$ALERT_EMAIL" 2>/dev/null || true
else
    log_message "Health check passed"
fi

# Check disk space
disk_usage=$(df / | awk 'NR==2{print $5}' | sed 's/%//')
if [ "$disk_usage" -gt 80 ]; then
    log_message "ALERT: High disk usage: ${disk_usage}%"
    echo "Disk usage is at ${disk_usage}%" | mail -s "Disk Space Alert" "$ALERT_EMAIL" 2>/dev/null || true
fi

# Check memory usage
mem_usage=$(free | awk 'NR==2{printf "%.2f", $3*100/$2}')
if (( $(echo "$mem_usage > 90" | bc -l) )); then
    log_message "ALERT: High memory usage: ${mem_usage}%"
fi

log_message "Monitoring check completed"
EOF

chmod +x scripts/monitor.sh
echo "✅ Monitoring script created: scripts/monitor.sh"

# Create backup cron job template
echo "⏰ Creating backup cron job template..."
cat > /tmp/sweetshop-cron << 'EOF'
# Sweet Shop Management System - Cron Jobs

# Daily database backup at 2 AM
0 2 * * * /path/to/your/app/scripts/backup-db.sh

# Hourly monitoring
0 * * * * /path/to/your/app/scripts/monitor.sh

# Weekly log cleanup
0 3 * * 0 find /path/to/your/app/logs -name "*.log" -mtime +30 -delete

# Daily restart (optional - for memory cleanup)
0 4 * * * systemctl restart sweetshop
EOF

echo "ℹ️ Cron job template created at /tmp/sweetshop-cron"
echo "   Customize paths and add to your crontab"

echo ""
echo "🎉 Production environment setup completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Copy .env.production.template to .env.production and configure"
echo "   2. Set up SSL certificates for HTTPS"
echo "   3. Configure nginx with the provided template"
echo "   4. Set up systemd service for automatic startup"
echo "   5. Configure log rotation and monitoring"
echo "   6. Set up automated backups with cron"
echo "   7. Test the deployment with scripts/verify-deployment.sh"
echo ""
echo "🔒 Security reminders:"
echo "   - Change all default passwords and secrets"
echo "   - Configure firewall rules"
echo "   - Set up fail2ban for intrusion prevention"
echo "   - Enable automatic security updates"
echo "   - Regular security audits with npm audit"
echo ""
echo "✅ Sweet Shop Management System is ready for production deployment!"
