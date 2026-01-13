
const { Worker } = require('bullmq');
const { QUEUE_CONFIG, redisConnection } = require('../config/queue');
const { orders, User } = require('../models');

const processNotification = async (job) => {
  const { type, orderId, userId, reason } = job.data;
  
  console.log(`[Notification Worker ${process.pid}] Processing ${type} notification for order ${orderId}`);

  try {
    const order = await orders.findByPk(orderId, {
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (type === 'order-confirmation') {
      if (order.User && order.User.email) {
        console.log(`[Notification Worker ${process.pid}] Sending email to ${order.User.email} for order ${order.orderNumber}`);
       
      }

      if (order.User && order.User.phone) {
        console.log(`[Notification Worker ${process.pid}] Sending SMS to ${order.User.phone} for order ${order.orderNumber}`);
       
      }
    } else if (type === 'payment-failed') {
      if (order.User && order.User.email) {
        console.log(`[Notification Worker ${process.pid}] Sending payment failed email to ${order.User.email}`);
      }
    }

    console.log(`[Notification Worker ${process.pid}] Notification sent for order ${orderId}`);
    return { success: true, orderId, userId };
  } catch (error) {
    console.error(`[Notification Worker ${process.pid}] Error processing notification:`, error);
    throw error;
  }
};

const createNotificationWorker = () => {
  const worker = new Worker(
    QUEUE_CONFIG.QUEUES.NOTIFICATIONS,
    processNotification,
    {
      connection: redisConnection,
      concurrency: QUEUE_CONFIG.WORKER_CONFIG.concurrency * 2, // Notifications can be processed faster (20 concurrent)
      limiter: {
        max: 200, // Max 200 notifications per second
        duration: 1000,
      },
    }
  );

  // Worker event handlers
  worker.on('completed', (job) => {
    console.log(`[Notification Worker ${process.pid}] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Notification Worker ${process.pid}] Job ${job?.id} failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error(`[Notification Worker ${process.pid}] Worker error:`, err);
  });

  return worker;
};

const startNotificationWorker = () => {
  console.log(`[Notification Worker ${process.pid}] Starting...`);
  const worker = createNotificationWorker();
  console.log(`[Notification Worker ${process.pid}] Started successfully`);
  console.log(`[Notification Worker ${process.pid}] Concurrency: ${QUEUE_CONFIG.WORKER_CONFIG.concurrency * 2}`);
  return worker;
};

process.on('SIGTERM', async () => {
  console.log(`[Notification Worker ${process.pid}] SIGTERM received, shutting down gracefully...`);
  if (worker) {
    await worker.close();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log(`[Notification Worker ${process.pid}] SIGINT received, shutting down gracefully...`);
  if (worker) {
    await worker.close();
  }
  process.exit(0);
});

let worker;
if (require.main === module) {
  worker = startNotificationWorker();
}

module.exports = { startNotificationWorker, createNotificationWorker };
