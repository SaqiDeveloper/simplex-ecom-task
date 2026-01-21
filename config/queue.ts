import { Queue, QueueEvents, JobsOptions } from 'bullmq';
import Redis from 'ioredis';

interface RedisConnectionOptions {
  host: string;
  port: number;
  password?: string;
  maxRetriesPerRequest: null;
  enableReadyCheck: boolean;
  lazyConnect: boolean;
  retryStrategy: (times: number) => number;
}

const redisConnection: RedisConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
  retryStrategy: (times: number): number => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

const redis = new Redis(redisConnection);

export const QUEUE_CONFIG = {
  QUEUES: {
    PAYMENT_PROCESSING: 'payment-processing',
    NOTIFICATIONS: 'notifications',
    ORDER_PROCESSING: 'order-processing',
  },
  
  JOB_OPTIONS: {
    attempts: 3,
    backoff: {
      type: 'exponential' as const,
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
} as const;

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

paymentQueueEvents.on('completed', ({ jobId }: { jobId: string }) => {
  console.log(`Payment job ${jobId} completed`);
});

paymentQueueEvents.on('failed', ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
  console.error(`Payment job ${jobId} failed:`, failedReason);
});

notificationQueueEvents.on('completed', ({ jobId }: { jobId: string }) => {
  console.log(`Notification job ${jobId} completed`);
});

notificationQueueEvents.on('failed', ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
  console.error(`Notification job ${jobId} failed:`, failedReason);
});

export const addJob = async <T = any>(
  queue: Queue,
  jobName: string,
  data: T,
  options: Partial<JobsOptions> = {}
): Promise<any> => {
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

interface QueueStats {
  queue: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  total: number;
}

export const getQueueStats = async (queue: Queue): Promise<QueueStats | null> => {
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

interface HealthCheckResult {
  status: string;
  redis?: string;
  error?: string;
  queues?: {
    payment: QueueStats | null;
    notification: QueueStats | null;
    order: QueueStats | null;
  };
  timestamp: string;
}

export const healthCheck = async (): Promise<HealthCheckResult> => {
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
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    };
  }
};

export const closeConnections = async (): Promise<void> => {
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

export {
  paymentQueue,
  notificationQueue,
  orderQueue,
  paymentQueueEvents,
  notificationQueueEvents,
  redisConnection,
  redis,
};

