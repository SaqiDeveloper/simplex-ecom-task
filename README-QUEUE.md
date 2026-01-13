# Queue System Documentation

## Overview
This project uses **BullMQ** for high-concurrency background job processing. The system is designed to handle **5 million orders in parallel** with horizontal scaling capabilities.

## Architecture

### Components:
1. **API Server** - Handles HTTP requests, queues jobs
2. **Workers** - Process background jobs (payment, notifications)
3. **Redis** - Message broker for BullMQ
4. **Queues** - Separate queues for different job types

### Queue System:
- **Payment Processing Queue** - Processes payments asynchronously
- **Notification Queue** - Sends emails/SMS in background
- **Order Processing Queue** - For future order processing tasks

## Setup

### 1. Install Redis
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis

# Start Redis
redis-server
```

### 2. Environment Variables
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password (optional)
```

### 3. Start API Server
```bash
# Development
npm start

# Production with PM2 (handles clustering automatically)
npm run start:pm2
# Or: pm2 start ecosystem.config.js
```

### 4. Start Workers
Workers should be run in separate processes for horizontal scaling:

```bash
# Start payment worker
npm run worker:payment

# Start notification worker
npm run worker:notification
```

## Scaling for High Concurrency

### Horizontal Scaling:
1. **API Server Scaling:**
   - Use PM2: `npm run start:pm2` (handles clustering automatically)
   - Or run multiple instances behind load balancer
   - Each instance can handle requests independently

2. **Worker Scaling:**
   - Run multiple worker instances:
     ```bash
     # Terminal 1
     npm run worker:payment
     
     # Terminal 2
     npm run worker:payment
     
     # Terminal 3
     npm run worker:notification
     ```
   - Each worker processes jobs concurrently (10 jobs per worker by default)
   - With 10 workers × 10 concurrency = 100 jobs processed simultaneously

3. **Database Optimization:**
   - Use connection pooling (already configured in Sequelize)
   - Add indexes on frequently queried columns
   - Use read replicas for read-heavy operations

### Configuration for 5M Orders:
- **Workers:** Run 50-100 worker instances
- **Concurrency:** 10 jobs per worker = 500-1000 concurrent jobs
- **Redis:** Use Redis Cluster for high availability
- **Database:** PostgreSQL with connection pooling, read replicas

## Monitoring


This shows:
- Queue health
- Waiting/Active/Completed/Failed job counts
- Worker status

## Job Processing Flow

1. **Checkout Request** → API Server
2. **Order Created** → Database
3. **Payment Job Queued** → BullMQ (Redis)
4. **Worker Picks Job** → Processes payment
5. **Notification Job Queued** → BullMQ
6. **Worker Sends Email/SMS** → Background

## Features

- ✅ **Non-blocking** - API responds immediately
- ✅ **Retry Logic** - Automatic retries with exponential backoff
- ✅ **Priority Jobs** - High priority for payments
- ✅ **Job Persistence** - Jobs survive server restarts
- ✅ **Horizontal Scaling** - Run multiple workers
- ✅ **Monitoring** - Queue statistics and health checks
- ✅ **Error Handling** - Failed jobs tracked and retried
