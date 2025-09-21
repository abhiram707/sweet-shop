# Sweet Shop Management System - Backend

A Node.js/Express backend API for the Sweet Shop Management System.

## Features

- JWT-based authentication
- RESTful API for sweet products management
- SQLite database with automatic migration
- Role-based access control (Admin/Customer)
- Input validation and sanitization
- Security middleware (Helmet, CORS, Rate limiting)
- Logging with Winston
- Comprehensive testing with Vitest

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Environment Setup
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Testing
```bash
npm test
npm run test:coverage
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Sweets Management
- `GET /api/sweets` - Get all sweets
- `POST /api/sweets` - Create new sweet (Admin only)
- `PUT /api/sweets/:id` - Update sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete sweet (Admin only)

### Health Check
- `GET /health` - Server health status

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3003 |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `DATABASE_URL` | SQLite database path | ./database.sqlite |
| `BCRYPT_ROUNDS` | Password hashing rounds | 10 |

## Deployment

### Using PM2
```bash
npm install -g pm2
npm run build
pm2 start dist/index.js --name "sweet-shop-backend"
```

### Using Docker
```bash
docker build -t sweet-shop-backend .
docker run -p 3003:3003 sweet-shop-backend
```

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (admin/customer)
- `created_at` - Registration timestamp

### Sweets Table
- `id` - Primary key
- `name` - Product name
- `category` - Product category
- `price` - Product price
- `quantity` - Stock quantity
- `description` - Product description
- `image_url` - Product image URL
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Request rate limiting
- Input validation and sanitization
- CORS protection
- Helmet security headers
- SQL injection prevention

## License

MIT
