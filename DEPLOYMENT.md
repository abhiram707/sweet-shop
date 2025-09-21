# Sweet Shop Management System - Deployment Guide

## 🚀 Production Deployment

This guide covers deploying the Sweet Shop Management System to production environments.

### Prerequisites

- Docker & Docker Compose
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- SSL certificates (for HTTPS)
- Domain name

### Quick Start

1. **Clone and prepare the repository:**
```bash
git clone <your-repo-url>
cd sweet-shop-management-system
chmod +x scripts/*.sh
```

2. **Set up production environment:**
```bash
./scripts/setup-production.sh
cp .env.production.template .env.production
# Edit .env.production with your values
```

3. **Deploy with Docker:**
```bash
./scripts/deploy.sh
```

### Manual Deployment

#### 1. Environment Configuration

Create `.env.production`:
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/sweetshop_prod
JWT_SECRET=your-super-secure-secret
REDIS_URL=redis://localhost:6379
FRONTEND_URL=https://your-domain.com
```

#### 2. Database Setup

**PostgreSQL:**
```bash
# Create database
createdb sweetshop_production

# Run migrations (if any)
npm run db:migrate
```

#### 3. Build Applications

```bash
# Install dependencies
npm ci --production=false

# Build both frontend and backend
npm run build:all

# Run tests
npm run test:coverage
```

#### 4. Docker Deployment

**Development/Staging:**
```bash
docker-compose up -d
```

**Production:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d
```

#### 5. SSL Configuration

Place your SSL certificates in the `ssl/` directory:
- `ssl/certificate.crt`
- `ssl/private.key`

Update nginx configuration in `docker/nginx.prod.conf` with your domain.

### Health Checks

- **Application Health:** `GET /health`
- **Readiness Check:** `GET /health/ready`
- **Liveness Check:** `GET /health/live`

### Monitoring

#### Basic Monitoring Script

```bash
# Run monitoring check
./scripts/monitor.sh

# Set up cron job for continuous monitoring
crontab -e
# Add: 0 * * * * /path/to/your/app/scripts/monitor.sh
```

#### Log Management

```bash
# View application logs
docker-compose logs -f backend

# View nginx logs
docker-compose logs -f nginx
```

### Backup Strategy

#### Database Backups

```bash
# Manual backup
./scripts/backup-db.sh

# Automated daily backups (add to crontab)
0 2 * * * /path/to/your/app/scripts/backup-db.sh
```

### Security Checklist

- [ ] Change all default passwords
- [ ] Configure firewall rules
- [ ] Set up fail2ban
- [ ] Enable automatic security updates
- [ ] Configure SSL/TLS properly
- [ ] Set up monitoring and alerting
- [ ] Regular security audits

### Performance Optimization

#### Backend Optimizations

1. **Database Connection Pooling:**
   - Already configured in `server/config/database-postgres.ts`
   - Adjust pool size based on load

2. **Redis Caching:**
   - Session storage
   - API response caching
   - Rate limiting storage

3. **Process Management:**
   - Use PM2 for process management
   - Configure clustering for multiple cores

#### Frontend Optimizations

1. **Static Asset Caching:**
   - Nginx handles static file caching
   - CDN integration for global distribution

2. **Compression:**
   - Gzip compression enabled in nginx
   - Brotli compression for better performance

### Scaling Considerations

#### Horizontal Scaling

1. **Load Balancer Configuration:**
```nginx
upstream backend {
    server backend1:3001;
    server backend2:3001;
    server backend3:3001;
}
```

2. **Database Scaling:**
   - Read replicas for read-heavy workloads
   - Connection pooling optimization
   - Query optimization

3. **Session Management:**
   - Redis for shared session storage
   - Stateless JWT tokens

### Troubleshooting

#### Common Issues

1. **Database Connection Issues:**
```bash
# Check database connectivity
docker-compose exec backend node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()').then(console.log).catch(console.error);
"
```

2. **Memory Issues:**
```bash
# Check container memory usage
docker stats

# Adjust container memory limits in docker-compose.production.yml
```

3. **SSL Certificate Issues:**
```bash
# Test SSL configuration
openssl s_client -connect your-domain.com:443 -servername your-domain.com
```

#### Debug Mode

Enable debug logging:
```bash
export LOG_LEVEL=debug
docker-compose restart backend
```

### Maintenance

#### Regular Tasks

1. **Update Dependencies:**
```bash
npm update
npm audit fix
docker-compose build --no-cache
```

2. **Log Rotation:**
   - Configure logrotate for application logs
   - Clean up old Docker images and containers

3. **Database Maintenance:**
```bash
# Vacuum PostgreSQL (if needed)
docker-compose exec postgres psql -U $POSTGRES_USER -d $POSTGRES_DB -c "VACUUM ANALYZE;"
```

### CI/CD Integration

The project includes GitHub Actions workflows for:

- **Continuous Integration:** Automated testing and code quality checks
- **Security Scanning:** Dependency and container vulnerability scanning
- **Automated Deployment:** Build and deploy to staging/production
- **Dependency Updates:** Automated dependency update PRs

### Support

For production support:

1. Check application logs: `docker-compose logs`
2. Verify health endpoints: `curl http://localhost:3001/health`
3. Run verification script: `./scripts/verify-deployment.sh`
4. Check monitoring alerts and metrics

### License

This deployment guide is part of the Sweet Shop Management System project.
