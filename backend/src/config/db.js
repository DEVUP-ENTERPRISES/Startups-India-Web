const mongoose = require('mongoose');
const os = require('os');
const { logger } = require('../infrastructure/observability/logger');

async function connectDatabase(uri) {
  mongoose.set('strictQuery', true);

  // In PM2 cluster mode, divide pool across workers to avoid
  // overwhelming MongoDB (e.g. 4 workers × 10 = 40 total connections)
  const cpuCount = os.cpus().length;
  const isPM2Cluster = !!process.env.pm_id;
  const poolSize = isPM2Cluster ? Math.max(5, Math.floor(20 / cpuCount)) : 20;

  const isProduction = process.env.NODE_ENV === 'production';

  const connection = await mongoose.connect(uri, {
    maxPoolSize: poolSize,
    minPoolSize: 2,
    // Avoid building indexes in production - run migrations separately
    autoIndex: !isProduction,
    // Read from secondaries when available (Atlas read replicas)
    readPreference: isProduction ? 'secondaryPreferred' : 'primary',
    // How long to wait for a connection from the pool
    waitQueueTimeoutMS: 10000,
    // Socket timeout for operations
    socketTimeoutMS: 45000,
    // Server selection timeout
    serverSelectionTimeoutMS: 10000,
  });

  logger.info('MongoDB connected', {
    host: connection.connection.host,
    dbName: connection.connection.name,
    port: connection.connection.port,
    poolSize,
    readPreference: isProduction ? 'secondaryPreferred' : 'primary',
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });

  mongoose.connection.on('error', error => {
    logger.error('MongoDB connection error', error);
  });
}

async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected gracefully');
  } catch (err) {
    logger.warn('MongoDB disconnect error', { message: err.message });
  }
}

module.exports = { connectDatabase, disconnectDatabase };
