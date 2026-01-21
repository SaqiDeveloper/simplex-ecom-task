import { EventEmitter } from 'events';
import http from 'http';
import app from './app';
import db from './models';
import { healthCheck, redis } from './config/queue';
import { validateAndLog } from './utils/envValidator';

EventEmitter.defaultMaxListeners = 20;

validateAndLog();

const server = http.createServer(app);

const port = process.env.PORT || 4000;

const startServer = async (): Promise<void> => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection to PostgreSQL has been established successfully.');
    
    try {
      await redis.ping();
      console.log('Redis connected successfully');
      
      const health = await healthCheck();
      console.log('Queue system health:', JSON.stringify(health, null, 2));
    } catch (queueError) {
      console.warn('Redis connection failed. Queue system may not work:', (queueError as Error).message);
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

const exitHandler = (): void => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error): void => {
  console.log(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", async () => {
  console.log("SIGTERM received");
  const { closeConnections } = await import('./config/queue');
  await closeConnections();
  if (server) {
    server.close();
  }
});

