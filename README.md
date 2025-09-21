# Sweet Shop Management System - TDD Kata

A full-stack Sweet Shop Management System built with modern web technologies, following Test-Driven Development principles. This application provides comprehensive inventory management, user authentication, and a beautiful user interface for both customers and administrators.

![Sweet Shop Demo](https://images.unsplash.com/photo-1548909976-47b4350efdae?w=800&h=400&fit=crop)

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration/login with JWT tokens
- **Role-based Access Control**: Admin and customer roles with different permissions
- **Sweet Inventory Management**: Complete CRUD operations for sweet products
- **Search & Filter**: Advanced search by name, category, and price range
- **Purchase System**: Real-time inventory updates when customers buy sweets
- **Stock Management**: Low stock warnings and admin restocking capabilities

### Technical Highlights
- **Test-Driven Development**: Comprehensive test coverage following Red-Green-Refactor cycle
- **RESTful API**: Clean, documented API endpoints
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: Instant inventory updates across the application
- **Security**: Protected routes, input validation, and secure password handling

## 🛠️ Technology Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for API routing
- **Supabase** for database and authentication
- **JWT** for secure token-based authentication
- **bcryptjs** for password hashing
- **Vitest** for testing
- **Express-validator** for input validation

### Frontend
- **React** with **TypeScript**
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Context API** for state management
- **Custom hooks** for API interactions

### Database
- **PostgreSQL** via Supabase
- **Row Level Security** (RLS) policies
- **Comprehensive migrations** with proper schema design

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Sweets Management (Protected)
- `GET /api/sweets` - Get all sweets
- `POST /api/sweets` - Create new sweet (Admin only)
- `PUT /api/sweets/:id` - Update sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete sweet (Admin only)
- `GET /api/sweets/search` - Search sweets with filters

### Inventory Operations (Protected)
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (Admin only)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd sweet-shop-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret_key
   PORT=3001
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the migration files in `/supabase/migrations/` in your Supabase SQL editor

5. **Start the development servers**
   
   **Backend (Terminal 1):**
   ```bash
   npm run dev:server
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Demo Credentials
For testing purposes, you can create accounts with these sample credentials:
- **Admin**: admin@demo.com / demo123
- **Customer**: customer@demo.com / demo123

## 🧪 Testing

### Run Backend Tests
```bash
npm run test:server
```

### Run Frontend Tests  
```bash
npm run test
```

### Test Coverage
The application includes comprehensive tests for:
- Authentication services
- Sweet management operations
- API endpoints validation
- Error handling scenarios
- Database operations

## 🏗️ Project Structure

```
sweet-shop-management-system/
├── server/                 # Backend API
│   ├── controllers/       # API controllers
│   ├── services/         # Business logic
│   ├── middleware/       # Authentication & validation
│   ├── routes/          # API routes
│   ├── validators/      # Input validation
│   ├── __tests__/       # Test files
│   └── types/           # TypeScript types
├── src/                  # Frontend React app
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── hooks/          # Custom hooks
│   └── types/          # TypeScript types
├── supabase/           # Database migrations
└── docs/              # Documentation
```

## 📱 Screenshots

### Authentication Page
Clean, modern login/registration interface with role selection.

### Dashboard
Comprehensive overview with inventory statistics and search functionality.

### Sweet Management
Intuitive cards displaying sweet details with purchase and admin controls.

### Admin Features
Full CRUD operations with forms for adding/editing sweets and restocking.

## 🔧 Development Workflow

This project follows **Test-Driven Development (TDD)**:

1. **Red**: Write failing tests first
2. **Green**: Write minimal code to make tests pass
3. **Refactor**: Improve code while keeping tests green

### Commit Message Convention
```
type(scope): description

Co-authored-by: AI Tool Name <AI@users.noreply.github.com>
```

## 🤖 My AI Usage

### AI Tools Used
- **GitHub Copilot**: Used for generating boilerplate code, completing repetitive patterns, and suggesting test cases
- **Claude (Sonnet 4)**: Used for architectural decisions, code reviews, and complex problem-solving

### How AI Enhanced My Workflow

1. **Boilerplate Generation**: AI helped generate initial component structures, API endpoints, and test templates, allowing me to focus on business logic and unique features.

2. **Test Case Suggestions**: When writing tests, AI suggested edge cases and scenarios I might have missed, improving test coverage.

3. **Code Completion**: For repetitive patterns like form validation, API calls, and component props, AI accelerated development significantly.

4. **Documentation**: AI assisted in generating comprehensive README sections and inline code comments.

5. **Debugging**: AI helped identify potential issues in code and suggested solutions for complex bugs.

### Reflection on AI Impact

Using AI tools transformed my development process by:
- **Reducing Development Time**: AI handled routine coding tasks, allowing more time for architecture and user experience design
- **Improving Code Quality**: AI suggestions often included best practices and patterns I might not have considered
- **Enhanced Learning**: AI explanations helped me understand complex concepts and alternative approaches
- **Better Testing**: AI suggested comprehensive test scenarios, improving application reliability

The key was maintaining a balance - using AI as a powerful assistant while ensuring I understood every line of code and made thoughtful architectural decisions. AI never replaced critical thinking but significantly amplified productivity and code quality.

## 🚢 Production Deployment

This application is production-ready with enterprise-grade features:

### 🏗️ Infrastructure
- **Docker**: Multi-stage builds with security optimizations
- **PostgreSQL**: Production database with connection pooling
- **Redis**: Session storage and caching
- **Nginx**: Reverse proxy with SSL/TLS termination
- **CI/CD**: GitHub Actions for automated testing and deployment

### 🔒 Security Features
- Rate limiting and DDoS protection
- Input validation and sanitization
- Security headers and CORS configuration
- JWT-based authentication with secure session management
- SQL injection prevention and XSS protection

### 📊 Monitoring & Logging
- Structured logging with Winston
- Health check endpoints for monitoring
- Performance metrics and error tracking
- Automated backup system

### 🚀 Quick Production Deploy

```bash
# 1. Clone and setup
git clone <repo-url>
cd sweet-shop-management-system
chmod +x scripts/*.sh

# 2. Configure production environment
./scripts/setup-production.sh
cp .env.production.template .env.production
# Edit .env.production with your values

# 3. Deploy with Docker
./scripts/deploy.sh

# 4. Verify deployment
./scripts/verify-deployment.sh
```

### 📚 Production Documentation
- **[Deployment Guide](DEPLOYMENT.md)** - Complete production setup guide
- **Health Checks**: `/health`, `/health/ready`, `/health/live`
- **Monitoring**: Automated health monitoring and alerting
- **Backup**: Automated daily database backups

### 🌐 Deployment Platforms
- **Docker**: Production-ready containerization
- **Kubernetes**: Scalable orchestration support
- **Cloud Providers**: AWS, GCP, Azure compatible
- **VPS/Dedicated**: Complete deployment scripts included

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes with proper co-author attribution
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for educational purposes as part of a TDD kata exercise.

## 🙏 Acknowledgments

- Built following TDD principles and modern web development best practices
- Enhanced with AI assistance while maintaining code quality and understanding
- Inspired by real-world e-commerce and inventory management systems
