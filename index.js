/**
 * Application Entry Point
 * Production-level server initialization with environment validation
 */

require("events").EventEmitter.defaultMaxListeners = 20;
const http = require("http");
const app = require("./app");
const { sequelize } = require('./models');
const { healthCheck, redis } = require('./config/queue');
const { validateAndLog } = require('./utils/envValidator');

// Validate environment variables before starting server
// This will exit the process if validation fails
validateAndLog();

const server = http.Server(app);

const port = process.env.PORT;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL has been established successfully.');
    
    // Initialize Redis connection (for BullMQ)
    try {
      await redis.ping();
      console.log('Redis connected successfully');
      
      // Health check
      const health = await healthCheck();
      console.log('Queue system health:', JSON.stringify(health, null, 2));
    } catch (queueError) {
      console.warn('Redis connection failed. Queue system may not work:', queueError.message);
      console.warn('Make sure Redis is running for background job processing');
    }
    
    server.listen(port, () => {
      console.log(`App is listening on port ${port}`);
      console.log('API Server started. Workers should be run separately for background processing.');
      console.log('To start workers:');
      console.log('  - npm run worker:payment');
      console.log('  - npm run worker:notification');
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.log(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", async () => {
  console.log("SIGTERM received");
  const { closeConnections } = require('./config/queue');
  await closeConnections();
  if (server) {
    server.close();
  }
});
