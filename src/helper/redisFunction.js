const RedisHelper = require('../cache/redis');

async function getAllDriverIdsFromRedis() {
  const redisHelper = new RedisHelper();
  try {
    const redisClient = await redisHelper.connect();
    const keys = await redisClient.keys('driver:*:location');
    const driverIds = keys.map((key) => key.split(':')[1]);
    await redisHelper.disconnect();
    return driverIds;
  } catch (error) {
    await redisHelper.disconnect();
    throw error;
  }
}

module.exports = getAllDriverIdsFromRedis;
