/**
 * PM2 Ecosystem Configuration
 * PM2 already handles clustering, so cluster.js is not needed
 * Run: pm2 start ecosystem.config.js
 */

module.exports = {
  apps: [
    {
      name: 'ecom-api',
      script: './index.js',
      instances: 'max', // Use all CPU cores, or specify number like 4
      exec_mode: 'cluster', // Cluster mode (PM2 handles clustering)
      env: {
        NODE_ENV: 'development',
        PORT: process.env.PORT || 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
      },
      // Auto restart on crash
      autorestart: true,
      // Watch for file changes (development only)
      watch: false,
      // Max memory before restart
      max_memory_restart: '1G',
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Merge logs from all instances
      merge_logs: true,
    },
    {
      name: 'payment-worker',
      script: './workers/payment.worker.js',
      instances: 5, // Run 5 payment worker instances
      exec_mode: 'fork', // Fork mode for workers (not cluster)
      env: {
        NODE_ENV: 'production',
      },
      autorestart: true,
      max_memory_restart: '500M',
      error_file: './logs/payment-worker-error.log',
      out_file: './logs/payment-worker-out.log',
    },
    {
      name: 'notification-worker',
      script: './workers/notification.worker.js',
      instances: 3, // Run 3 notification worker instances
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      autorestart: true,
      max_memory_restart: '500M',
      error_file: './logs/notification-worker-error.log',
      out_file: './logs/notification-worker-out.log',
    },
  ],
};

