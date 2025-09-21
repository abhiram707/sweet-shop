import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import sweetRoutes from './routes/sweets.js';
import { initDatabase } from './config/database.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { sanitizeInput, securityHeaders } from './middleware/security.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Track server health
let isServerReady = false;
let dbConnectionHealthy = false;
const startTime = Date.now();

// Initialize database and start server
async function startServer() {
  try {
    logger.info('Starting Sweet Shop Management System server...');
    
    // Initialize database first (this also initializes the helpers)
    await initDatabase();
    dbConnectionHealthy = true;
    logger.info('Database and helpers initialized');
    
    logger.info('Setting up middleware...');

    // Security middleware
    app.use(helmet({
      contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false,
    }));
    app.use(cors({
      origin: NODE_ENV === 'production' 
        ? [
            process.env.FRONTEND_URL,
            'https://sweet-shop-abhiram707.vercel.app',
            /.*\.vercel\.app$/
          ].filter(Boolean)
        : true,
      credentials: true,
    }));
    
    // Rate limiting
    app.use(generalLimiter);
    
    // Logging
    app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
    
    // Body parsing with security
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(sanitizeInput);
    app.use(securityHeaders);

    // Health check endpoints
    app.get('/health', (req, res) => {
      const uptime = Date.now() - startTime;
      const healthStatus = {
        status: isServerReady ? 'OK' : 'Starting',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 1000)}s`,
        environment: NODE_ENV,
        database: dbConnectionHealthy ? 'connected' : 'disconnected',
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0'
      };
      
      const statusCode = isServerReady && dbConnectionHealthy ? 200 : 503;
      res.status(statusCode).json(healthStatus);
    });

    app.get('/health/ready', (req, res) => {
      if (isServerReady && dbConnectionHealthy) {
        res.status(200).json({ status: 'Ready' });
      } else {
        res.status(503).json({ status: 'Not Ready' });
      }
    });

    app.get('/health/live', (req, res) => {
      res.status(200).json({ status: 'Alive' });
    });

    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/sweets', sweetRoutes);

    // API documentation
    app.get('/api', (req, res) => {
      res.json({
        name: 'Sweet Shop Management System API',
        version: '1.0.0',
        endpoints: {
          auth: '/api/auth (POST /login, POST /register)',
          sweets: '/api/sweets (GET, POST, PUT, DELETE)',
          health: '/health, /health/ready, /health/live'
        }
      });
    });

    // Error handling
    app.use(errorHandler);

    // 404 handler
    app.use((req, res) => {
      logger.warn(`404 - Route not found: ${req.method} ${req.url}`);
      res.status(404).json({ error: 'Route not found' });
    });

    // Start server
    const server = app.listen(PORT, () => {
      isServerReady = true;
      logger.info(`Sweet Shop Management System server running on port ${PORT}`);
      logger.info(`Environment: ${NODE_ENV}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info(`API documentation: http://localhost:${PORT}/api`);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        logger.error('Server error:', err);
        process.exit(1);
      }
    });
    
    logger.info('Server listener created successfully');

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      isServerReady = false;
      
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;