const { Queue, Worker, QueueEvents } = require('bullmq');
const Redis = require('ioredis');

const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

const redis = new Redis(redisConnection);

const QUEUE_CONFIG = {
  QUEUES: {
    PAYMENT_PROCESSING: 'payment-processing',
    NOTIFICATIONS: 'notifications',
    ORDER_PROCESSING: 'order-processing',
  },
  
  JOB_OPTIONS: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 3600,
      count: 1000,
    },
    
    removeOnFail: {
      age: 86400,
    },
    
    PRIORITY: {
      HIGH: 20,
      MEDIUM: 10,
      LOW: 1,
    },
  },
  
  WORKER_CONFIG: {
    concurrency: 10,
    connection: redisConnection,
    limiter: {
      max: 100,
      duration: 1000,
    },
  },
};

const paymentQueue = new Queue(QUEUE_CONFIG.QUEUES.PAYMENT_PROCESSING, {
  connection: redisConnection,
  defaultJobOptions: QUEUE_CONFIG.JOB_OPTIONS,
});

const notificationQueue = new Queue(QUEUE_CONFIG.QUEUES.NOTIFICATIONS, {
  connection: redisConnection,
  defaultJobOptions: QUEUE_CONFIG.JOB_OPTIONS,
});

const orderQueue = new Queue(QUEUE_CONFIG.QUEUES.ORDER_PROCESSING, {
  connection: redisConnection,
  defaultJobOptions: QUEUE_CONFIG.JOB_OPTIONS,
});

const paymentQueueEvents = new QueueEvents(QUEUE_CONFIG.QUEUES.PAYMENT_PROCESSING, {
  connection: redisConnection,
});

const notificationQueueEvents = new QueueEvents(QUEUE_CONFIG.QUEUES.NOTIFICATIONS, {
  connection: redisConnection,
});

paymentQueueEvents.on('completed', ({ jobId }) => {
  console.log(`Payment job ${jobId} completed`);
});

paymentQueueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`Payment job ${jobId} failed:`, failedReason);
});

notificationQueueEvents.on('completed', ({ jobId }) => {
  console.log(`Notification job ${jobId} completed`);
});

notificationQueueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`Notification job ${jobId} failed:`, failedReason);
});

const addJob = async (queue, jobName, data, options = {}) => {
  try {
    const job = await queue.add(jobName, data, {
      priority: options.priority || QUEUE_CONFIG.JOB_OPTIONS.PRIORITY.MEDIUM,
      ...options,
    });
    return job;
  } catch (error) {
    console.error(`Error adding job to ${queue.name}:`, error);
    throw error;
  }
};

const getQueueStats = async (queue) => {
  try {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return {
      queue: queue.name,
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  } catch (error) {
    console.error(`Error getting stats for ${queue.name}:`, error);
    return null;
  }
};

const healthCheck = async () => {
  try {
    await redis.ping();
    return {
      status: 'healthy',
      redis: 'connected',
      queues: {
        payment: await getQueueStats(paymentQueue),
        notification: await getQueueStats(notificationQueue),
        order: await getQueueStats(orderQueue),
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

const closeConnections = async () => {
  try {
    await paymentQueue.close();
    await notificationQueue.close();
    await orderQueue.close();
    await paymentQueueEvents.close();
    await notificationQueueEvents.close();
    await redis.quit();
    console.log('All queue connections closed');
  } catch (error) {
    console.error('Error closing queue connections:', error);
  }
};

module.exports = {
  paymentQueue,
  notificationQueue,
  orderQueue,
  paymentQueueEvents,
  notificationQueueEvents,
  
  addJob,
  getQueueStats,
  healthCheck,
  closeConnections,
  
  // Configuration
  QUEUE_CONFIG,
  redisConnection,
  redis,
};
