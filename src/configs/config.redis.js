// config/redis.config.js
require('dotenv').config();

const config = {
  // Môi trường mặc định là development
  development: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || null,
    db: parseInt(process.env.REDIS_DB) || 0,
    connectTimeout: 10000,
    // Các cài đặt retry khi mất kết nối
    retryStrategy: (times) => {
      if (times > 3) {
        console.log('Redis retry attempt:', times);
        return Math.min(times * 200, 3000);
      }
      return null;
    },
    // Các cài đặt khác
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    keepAlive: 30000,
    family: 4, // 4 (IPv4) or 6 (IPv6)
    keyPrefix: process.env.REDIS_PREFIX || 'dev:',
  },

  // Môi trường production
  production: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB) || 0,
    connectTimeout: 15000,
    tls: process.env.REDIS_TLS === 'true' ? {} : null,
    retryStrategy: (times) => {
      if (times > 5) {
        console.error('Redis connection failed after 5 attempts');
        return null;
      }
      return Math.min(times * 500, 5000);
    },
    maxRetriesPerRequest: 5,
    enableReadyCheck: true,
    keepAlive: 60000,
    family: 4,
    keyPrefix: process.env.REDIS_PREFIX || 'prod:',
  },

  // Môi trường test
  test: {
    host: 'localhost',
    port: 6379,
    password: null,
    db: 1,
    keyPrefix: 'test:',
    // Cấu hình đơn giản hơn cho môi trường test
    connectTimeout: 5000,
    maxRetriesPerRequest: 1,
  },
};

// Hàm lấy config dựa trên môi trường
const getRedisConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  const envConfig = config[env];

  if (!envConfig) {
    throw new Error(`Redis configuration not found for environment: ${env}`);
  }

  return envConfig;
};

module.exports = {
  getRedisConfig,
  redisConfig: config,
};
