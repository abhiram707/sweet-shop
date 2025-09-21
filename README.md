# Sweet Shop Management System

A full-stack e-commerce application for managing a sweet shop inventory with user authentication, role-based access control, and real-time inventory management. Built with modern web technologies and deployed to production.

![Sweet Shop Demo]([https://sweet-shop-one.vercel.app/]))

## 🚀 Live Application

**🌐 Production Deployment:**
- **Frontend**: https://sweet-shop-one.vercel.app (Vercel)
- **Backend API**: https://sweet-shop-z5mo.onrender.com (Render)
- **Status Page**: https://sweet-shop-z5mo.onrender.com/health

**🎯 Live Demo Access:**
- Visit the application at: **https://sweet-shop-one.vercel.app**
- Test admin features with: `admin@sweetshop.com` / `admin123`
- Create customer accounts for shopping experience

**✅ Deployment Status (Updated September 2025):**
- **Backend**: ✅ Successfully deployed on Render with PostgreSQL
- **Frontend**: ✅ Successfully deployed on Vercel
- **Database**: ✅ PostgreSQL production database configured
- **CORS**: ✅ Cross-origin requests properly configured
- **Authentication**: ✅ JWT-based auth working across domains
- **API Integration**: ✅ Frontend successfully communicating with backend

## 🎯 Quick Start Guide

### 🌐 **Access Live Application**
� **Live URL**: https://sweet-shop-one.vercel.app

### 🔑 **Demo Accounts**
- **Admin Access**: `admin@sweetshop.com` / `admin123`
- **Customer Access**: Register your own account or use any test email

### 🛒 **Features to Test**
1. **Customer Experience**: Browse sweets, add to cart, make purchases
2. **Admin Panel**: Manage inventory, add new sweets, restock items
3. **Search & Filter**: Find sweets by name, category, or price range
4. **Real-time Updates**: Watch stock levels change after purchases
## 📋 Table of Contents
- [Quick Start Guide](#-quick-start-guide)
- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Testing](#-testing)
- [Production Deployment](#-production-deployment)
- [Screenshots](#-screenshots)
- [My AI Usage](#-my-ai-usage)
- [Contributing](#-contributing)

## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based secure registration and login system
- **Role-based Access Control**: Separate admin and customer interfaces
- **Sweet Inventory Management**: Complete CRUD operations for sweet products
- **Advanced Search & Filtering**: Search by name, category, and price range
- **Real-time Purchase System**: Instant inventory updates when customers buy sweets
- **Stock Management**: Low stock warnings and admin restocking capabilities
- **Shopping Cart**: Full cart functionality with quantity management
- **Responsive Design**: Mobile-first design that works on all devices

### Technical Highlights
- **Production-Ready**: Deployed with proper CI/CD pipeline
- **Database Flexibility**: Works with both SQLite (development) and PostgreSQL (production)
- **Security**: Protected routes, input validation, rate limiting, and CORS
- **Error Handling**: Comprehensive error handling and logging
- **Performance**: Optimized with caching and database indexing

## 🛠️ Technology Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for API framework
- **PostgreSQL** (production) / **SQLite** (development)
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express-validator** for input validation
- **Winston** for logging
- **Helmet** for security headers
- **CORS** for cross-origin requests

### Frontend
- **React 18** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Context API** for state management
- **Custom hooks** for API interactions

### Database & Deployment
- **PostgreSQL** (Render Database)
- **Vercel** (Frontend hosting)
- **Render** (Backend hosting)
- **GitHub Actions** (CI/CD)

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

 Screenshots  

### 🔐 Authentication & Landing Page  
![Landing Page](assets/landing-page.png)

---

### 🛒 Product Showcase  
![Products](assets/products.png)

---

### 🛍️ Shopping Cart  
![Shopping Cart](assets/cart.png)

---

### 🛠️ Admin Panel  
![Admin Panel](assets/admin-panel.png)

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
- **GitHub Copilot**: Used extensively for code completion, generating boilerplate components, API endpoints, and suggesting test cases
- **Bolt.new (StackBlitz)**: Used for rapid prototyping, initial project scaffolding, and creating the foundational UI architecture with modern design patterns
- **Claude (Anthropic)**: Used for architectural decisions, deployment strategies, code reviews, and complex problem-solving

### How AI Enhanced My Workflow

1. **Rapid Prototyping with Bolt.new**: Used Bolt.new to quickly scaffold the initial project structure, create foundational React components, and establish the design system with modern UI patterns and responsive layouts.

2. **Boilerplate Generation**: GitHub Copilot helped generate component structures, API endpoints, and test templates, allowing me to focus on business logic and unique features.

3. **Test Case Suggestions**: When writing tests, AI suggested edge cases and scenarios I might have missed, improving test coverage.

4. **Code Completion**: For repetitive patterns like form validation, API calls, and component props, Copilot accelerated development significantly.

5. **Architecture Planning**: Claude assisted with high-level architectural decisions, deployment strategies, and security implementations.

6. **Documentation**: AI tools assisted in generating comprehensive README sections and inline code comments.

7. **Debugging & Problem Solving**: AI helped identify potential issues in code and suggested solutions for complex deployment problems.

### Reflection on AI Impact

Using multiple AI tools created a comprehensive development workflow:
- **Bolt.new for Rapid Prototyping**: Accelerated initial development with smart scaffolding and modern component patterns
- **GitHub Copilot for Development**: Handled routine coding tasks, allowing more time for architecture and user experience design  
- **Claude for Strategic Decisions**: Provided guidance on complex architectural choices and deployment strategies
- **Improved Code Quality**: AI suggestions often included best practices and patterns I might not have considered
- **Enhanced Learning**: AI explanations helped me understand complex concepts and alternative approaches
- **Better Testing**: AI suggested comprehensive test scenarios, improving application reliability

**Key Learning Points:**
1. **AI Synergy**: Using multiple AI tools for different aspects (prototyping, coding, architecture) created a more comprehensive development approach
2. **Critical Thinking**: The key was maintaining a balance - using AI as powerful assistants while ensuring I understood every line of code and made thoughtful decisions
3. **Quality Control**: AI never replaced critical thinking but significantly amplified productivity and code quality
4. **Modern Development**: This project demonstrates how AI tools can enhance modern full-stack development when used strategically

The result is a production-ready application deployed successfully with proper authentication, database integration, and responsive design - showcasing the power of AI-enhanced development.

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

## 🚀 Recent Updates & Deployment Success

### ✅ **Production Deployment Completed (September 2025)**

**What's Working:**
- **Full-Stack Application**: Successfully deployed and running in production
- **Backend API**: Render deployment with PostgreSQL database
- **Frontend Interface**: Vercel deployment with responsive design
- **Cross-Domain Authentication**: CORS properly configured for secure API calls
- **Data Consistency**: Fixed price formatting issues for PostgreSQL compatibility

**Key Problems Solved:**
1. **Price Formatting**: Created utility functions to handle PostgreSQL decimal strings
2. **CORS Configuration**: Updated backend to allow Vercel domain requests  
3. **Data Sanitization**: Added proper type conversion for API responses
4. **Authentication Flow**: JWT tokens working across frontend/backend domains

**Production URLs:**
- **Live Application**: https://sweet-shop-one.vercel.app
- **Backend API**: https://sweet-shop-z5mo.onrender.com
- **Health Check**: https://sweet-shop-z5mo.onrender.com/health

**Technology Stack in Production:**
- **Frontend**: React + TypeScript on Vercel
- **Backend**: Node.js + Express on Render
- **Database**: PostgreSQL (Render Database)
- **Authentication**: JWT with secure cross-origin configuration

## 🙏 Acknowledgments

- Built following TDD principles and modern web development best practices
- Enhanced with AI assistance while maintaining code quality and understanding
- Inspired by real-world e-commerce and inventory management systems
