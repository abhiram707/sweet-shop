import joi from 'joi';
import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific .env file
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
const envPath = path.join(process.cwd(), envFile);

dotenv.config({ path: envPath });
dotenv.config(); // Also load default .env if exists

// Define validation schema
const envSchema = joi.object({
  // Application
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
  PORT: joi.number().port().default(3001),
  APP_NAME: joi.string().default('Sweet Shop Management System'),
  APP_VERSION: joi.string().default('1.0.0'),

  // Database
  DATABASE_URL: joi.string().required(),
  DATABASE_TYPE: joi.string().valid('sqlite', 'postgresql').default('postgresql'),
  DATABASE_HOST: joi.string().when('DATABASE_TYPE', {
    is: 'postgresql',
    then: joi.required(),
    otherwise: joi.optional()
  }),
  DATABASE_PORT: joi.number().port().default(5432),
  DATABASE_NAME: joi.string().when('DATABASE_TYPE', {
    is: 'postgresql', 
    then: joi.required(),
    otherwise: joi.optional()
  }),
  DATABASE_USER: joi.string().when('DATABASE_TYPE', {
    is: 'postgresql',
    then: joi.required(), 
    otherwise: joi.optional()
  }),
  DATABASE_PASSWORD: joi.string().when('DATABASE_TYPE', {
    is: 'postgresql',
    then: joi.required(),
    otherwise: joi.optional()
  }),
  DATABASE_MAX_CONNECTIONS: joi.number().integer().min(1).max(100).default(20),
  DATABASE_IDLE_TIMEOUT: joi.number().integer().min(1000).default(30000),
  DATABASE_CONNECTION_TIMEOUT: joi.number().integer().min(1000).default(2000),

  // Authentication
  JWT_SECRET: joi.string().min(32).required(),
  JWT_EXPIRES_IN: joi.string().default('24h'),
  JWT_REFRESH_EXPIRES_IN: joi.string().default('7d'),
  BCRYPT_ROUNDS: joi.number().integer().min(8).max(15).default(12),

  // CORS
  CORS_ORIGIN: joi.string().default('*'),
  CORS_CREDENTIALS: joi.boolean().default(true),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: joi.number().integer().min(60000).default(900000),
  RATE_LIMIT_MAX_REQUESTS: joi.number().integer().min(10).default(100),
  AUTH_RATE_LIMIT_MAX: joi.number().integer().min(1).default(5),
  AUTH_RATE_LIMIT_WINDOW_MS: joi.number().integer().min(60000).default(900000),

  // Redis
  REDIS_URL: joi.string().optional(),
  REDIS_PASSWORD: joi.string().optional().allow(''),
  REDIS_HOST: joi.string().default('localhost'),
  REDIS_PORT: joi.number().port().default(6379),
  REDIS_DB: joi.number().integer().min(0).max(15).default(0),

  // File Upload
  MAX_FILE_SIZE: joi.number().integer().min(1024).default(10485760), // 10MB
  UPLOAD_DIR: joi.string().default('uploads'),
  ALLOWED_FILE_TYPES: joi.string().default('image/jpeg,image/png,image/webp'),

  // Email
  SMTP_HOST: joi.string().optional(),
  SMTP_PORT: joi.number().port().default(587),
  SMTP_SECURE: joi.boolean().default(false),
  SMTP_USER: joi.string().optional().allow(''),
  SMTP_PASS: joi.string().optional().allow(''),
  EMAIL_FROM: joi.string().email().optional(),

  // Monitoring
  SENTRY_DSN: joi.string().uri().optional().allow(''),
  GOOGLE_ANALYTICS_ID: joi.string().optional().allow(''),

  // SSL
  SSL_CERT_PATH: joi.string().optional(),
  SSL_KEY_PATH: joi.string().optional(),

  // Admin
  ADMIN_EMAIL: joi.string().email().default('admin@sweetshop.com'),
  ADMIN_PASSWORD: joi.string().min(8).default('admin123'),
  SUPER_ADMIN_IPS: joi.string().default('127.0.0.1,::1'),

  // External Services
  PAYMENT_GATEWAY_KEY: joi.string().optional().allow(''),
  PAYMENT_GATEWAY_SECRET: joi.string().optional().allow(''),
  PAYMENT_WEBHOOK_SECRET: joi.string().optional().allow(''),

  // Backup
  BACKUP_SCHEDULE: joi.string().optional(),
  BACKUP_RETENTION_DAYS: joi.number().integer().min(1).default(30),
  BACKUP_S3_BUCKET: joi.string().optional(),
  AWS_ACCESS_KEY_ID: joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: joi.string().optional(),
  AWS_REGION: joi.string().default('us-east-1'),

  // Feature Flags
  ENABLE_REGISTRATION: joi.boolean().default(true),
  ENABLE_EMAIL_VERIFICATION: joi.boolean().default(false),
  ENABLE_PASSWORD_RESET: joi.boolean().default(true),
  ENABLE_ADMIN_PANEL: joi.boolean().default(true),
  ENABLE_ANALYTICS: joi.boolean().default(true),

  // Performance
  CACHE_TTL: joi.number().integer().min(60).default(3600),
  SESSION_TTL: joi.number().integer().min(300).default(86400),
  COMPRESSION_LEVEL: joi.number().integer().min(1).max(9).default(6),

  // Development
  ENABLE_SWAGGER: joi.boolean().default(false),
  ENABLE_DEBUG_ROUTES: joi.boolean().default(false),
  ENABLE_QUERY_LOGGING: joi.boolean().default(false),
  DEBUG: joi.string().optional().allow('')
}).unknown(true); // Allow unknown keys for flexibility

// Validate environment variables
const { error, value: env } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

// Export typed configuration
export const config = {
  app: {
    env: env.NODE_ENV,
    port: env.PORT,
    name: env.APP_NAME,
    version: env.APP_VERSION,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test'
  },
  database: {
    url: env.DATABASE_URL,
    type: env.DATABASE_TYPE,
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    name: env.DATABASE_NAME,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    maxConnections: env.DATABASE_MAX_CONNECTIONS,
    idleTimeout: env.DATABASE_IDLE_TIMEOUT,
    connectionTimeout: env.DATABASE_CONNECTION_TIMEOUT
  },
  auth: {
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
    jwtRefreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    bcryptRounds: env.BCRYPT_ROUNDS
  },
  cors: {
    origin: env.CORS_ORIGIN.split(',').map((o: string) => o.trim()),
    credentials: env.CORS_CREDENTIALS
  },
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    authMax: env.AUTH_RATE_LIMIT_MAX,
    authWindowMs: env.AUTH_RATE_LIMIT_WINDOW_MS
  },
  redis: {
    url: env.REDIS_URL,
    password: env.REDIS_PASSWORD,
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    db: env.REDIS_DB
  },
  upload: {
    maxFileSize: env.MAX_FILE_SIZE,
    uploadDir: env.UPLOAD_DIR,
    allowedTypes: env.ALLOWED_FILE_TYPES.split(',').map((t: string) => t.trim())
  },
  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.EMAIL_FROM
  },
  monitoring: {
    sentryDsn: env.SENTRY_DSN,
    googleAnalyticsId: env.GOOGLE_ANALYTICS_ID
  },
  ssl: {
    certPath: env.SSL_CERT_PATH,
    keyPath: env.SSL_KEY_PATH
  },
  admin: {
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
    allowedIPs: env.SUPER_ADMIN_IPS.split(',').map((ip: string) => ip.trim())
  },
  payment: {
    gatewayKey: env.PAYMENT_GATEWAY_KEY,
    gatewaySecret: env.PAYMENT_GATEWAY_SECRET,
    webhookSecret: env.PAYMENT_WEBHOOK_SECRET
  },
  backup: {
    schedule: env.BACKUP_SCHEDULE,
    retentionDays: env.BACKUP_RETENTION_DAYS,
    s3Bucket: env.BACKUP_S3_BUCKET,
    awsAccessKeyId: env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    awsRegion: env.AWS_REGION
  },
  features: {
    enableRegistration: env.ENABLE_REGISTRATION,
    enableEmailVerification: env.ENABLE_EMAIL_VERIFICATION,
    enablePasswordReset: env.ENABLE_PASSWORD_RESET,
    enableAdminPanel: env.ENABLE_ADMIN_PANEL,
    enableAnalytics: env.ENABLE_ANALYTICS
  },
  performance: {
    cacheTtl: env.CACHE_TTL,
    sessionTtl: env.SESSION_TTL,
    compressionLevel: env.COMPRESSION_LEVEL
  },
  development: {
    enableSwagger: env.ENABLE_SWAGGER,
    enableDebugRoutes: env.ENABLE_DEBUG_ROUTES,
    enableQueryLogging: env.ENABLE_QUERY_LOGGING,
    debug: env.DEBUG
  }
};

export default config;
