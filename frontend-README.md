# Sweet Shop Management System - Frontend

A modern React frontend for the Sweet Shop Management System with glass morphism design.

## Features

- Modern React 18 with TypeScript
- Glass morphism UI design
- Responsive Tailwind CSS styling
- JWT authentication
- Admin panel for product management
- Shopping cart functionality
- Product search and filtering
- Image upload and management
- Real-time inventory updates

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Environment Setup
Create `.env.local` file:
```bash
VITE_API_URL=http://localhost:3003
VITE_APP_NAME=Sweet Shop Management System
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Testing
```bash
npm test
npm run test:coverage
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Admin/          # Admin panel components
│   ├── Auth/           # Authentication components
│   ├── Cart/           # Shopping cart components
│   ├── Dashboard/      # Dashboard components
│   ├── Layout/         # Layout components
│   └── Sweet/          # Product components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── styles/             # CSS styles
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Key Components

### Authentication
- `AuthPage` - Login/Register interface
- `LoginForm` - User login form
- `RegisterForm` - User registration form
- `AuthContext` - Authentication state management

### Product Management
- `SweetCard` - Product display card
- `SweetForm` - Product creation/editing form
- `FeaturedSweetCard` - Featured product display
- `SearchBar` - Product search functionality

### Admin Features
- `AdminPanel` - Complete admin dashboard
- `Dashboard` - Statistics and overview
- `RestockModal` - Inventory management

### Shopping Experience
- `ShoppingCart` - Cart management
- `CartContext` - Cart state management

## Styling

The application uses a modern glass morphism design with:
- Backdrop blur effects
- Translucent elements
- Gradient backgrounds
- Smooth animations
- Responsive design

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:3003 |
| `VITE_APP_NAME` | Application name | Sweet Shop Management System |

## Build and Deployment

### Static Hosting (Netlify, Vercel)
```bash
npm run build
# Deploy the 'dist' folder
```

### Docker
```bash
docker build -t sweet-shop-frontend .
docker run -p 3000:3000 sweet-shop-frontend
```

### Nginx Configuration
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Features

### User Authentication
- Secure JWT-based authentication
- Role-based access control
- Persistent login sessions

### Product Catalog
- Beautiful product grid display
- Category-based filtering
- Search functionality
- High-quality product images

### Admin Dashboard
- Complete inventory management
- Sales statistics
- User management
- Product CRUD operations

### Shopping Cart
- Add/remove items
- Quantity management
- Order summary
- Checkout process

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Code splitting for optimal loading
- Image optimization
- Lazy loading
- Bundle size optimization

## License

MIT
