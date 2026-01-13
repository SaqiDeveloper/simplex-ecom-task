# E-Commerce API

A scalable e-commerce API built with Node.js, Express, PostgreSQL, and BullMQ for high-concurrency order processing.

## Features

- 🔐 **Authentication** - JWT-based authentication with OTP login support
- 🛍️ **Product Management** - Products and variants with admin controls
- 🛒 **Shopping Cart** - Full cart management with items
- 💳 **Checkout & Orders** - Order processing with payment integration
- ⚡ **Background Jobs** - BullMQ for async payment and notification processing
- 📚 **API Documentation** - Swagger/OpenAPI documentation
- 🔒 **Role-Based Access** - Admin and user role management

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - Currently tested with v22.17.1
- **PostgreSQL** (v12 or higher) - Currently tested with v17.7
- **Redis** (v6 or higher) - Currently tested with v7.0.15
- **npm** (v6 or higher) - Currently tested with v10.9.2

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ecom
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Redis Configuration (for BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD= (optional)
```

### 4. Install and Start Redis

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis-server
```

#### macOS
```bash
brew install redis
brew services start redis
```

#### Verify Redis is running
```bash
redis-cli ping
# Should return: PONG
```

## Running the Project

### Development Mode

#### 1. Start API Server

```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

#### 2. Start Background Workers (Optional)

For background job processing (payments, notifications), start workers in separate terminals:

```bash
# Terminal 2 - Payment Worker
npm run worker:payment

# Terminal 3 - Notification Worker
npm run worker:notification
```

### Production Mode with PM2

#### 1. Install PM2 (if not installed)

```bash
npm install -g pm2
```

#### 2. Start with PM2

```bash
# Start API server and workers
npm run start:pm2

# Or directly
pm2 start ecosystem.config.js
```

#### 3. PM2 Commands

```bash
# Stop all processes
npm run stop:pm2

# Restart all processes
npm run restart:pm2

# View status
pm2 status

# View logs
pm2 logs

# Monitor
pm2 monit
```

## API Documentation

Once the server is running, access the Swagger documentation at:

```
http://localhost:3000/docs
```

## Available Scripts

```bash
# Development
npm start              # Start development server with nodemon

# Production (PM2)
npm run start:pm2      # Start with PM2 (clustering enabled)
npm run stop:pm2       # Stop PM2 processes
npm run restart:pm2     # Restart PM2 processes

# Workers
npm run worker:payment      # Start payment worker
npm run worker:notification # Start notification worker
```

## Project Structure

```
ecom/
├── config/              # Configuration files
│   ├── config.js        # Database configuration
│   ├── queue.js         # BullMQ queue configuration
│   └── swagger.js       # Swagger documentation config
├── controllers/         # Route controllers
│   ├── auth/           # Authentication routes
│   ├── product/        # Product routes
│   ├── cart/           # Cart routes
│   └── checkout/       # Checkout routes
├── migrations/          # Database migrations
├── models/             # Sequelize models
├── services/           # Business logic
├── middlewares/        # Express middlewares
├── swagger/            # Swagger documentation
│   └── paths/         # API path definitions
├── workers/            # Background job workers
├── utils/              # Utility functions
├── app.js             # Express app setup
├── index.js           # Server entry point
└── ecosystem.config.js # PM2 configuration
```

## API Endpoints

### Authentication
- `POST /sign-up` - User registration
- `POST /login` - User login
- `POST /admin/login` - Admin login
- `POST /otp/request` - Request OTP for login
- `POST /otp/verify` - Verify OTP and login

### Products
- `GET /product` - Get all products
- `GET /product/:productId` - Get single product
- `POST /product` - Create product (Admin only)
- `PATCH /product/:productId` - Update product (Admin only)
- `DELETE /product/:productId` - Delete product (Admin only)

### Product Variants
- `GET /product/variant` - Get all variants
- `GET /product/variant/:productId` - Get variants for a product
- `POST /product/variant/:productId` - Create variant (Admin only)
- `PATCH /product/variant/:variantId` - Update variant (Admin only)
- `DELETE /product/variant/:variantId` - Delete variant (Admin only)

### Cart
- `GET /cart` - Get or create cart
- `POST /cart/item` - Add item to cart
- `PATCH /cart/item/:itemId` - Update cart item
- `DELETE /cart/item/:itemId` - Remove item from cart
- `DELETE /cart/clear` - Clear entire cart

### Checkout & Orders
- `POST /checkout` - Create order from cart
- `GET /order/:orderId` - Get order details
- `GET /orders` - Get user's orders (paginated)

## Database Migrations

### Run Migrations
```bash
npx sequelize-cli db:migrate
```

### Rollback Last Migration
```bash
npx sequelize-cli db:migrate:undo
```

### Rollback All Migrations
```bash
npx sequelize-cli db:migrate:undo:all
```

## Queue System

This project uses **BullMQ** for background job processing. See [README-QUEUE.md](./README-QUEUE.md) for detailed queue system documentation.

### Quick Queue Commands

```bash
# Check Redis connection
redis-cli ping
```

## License

ISC

