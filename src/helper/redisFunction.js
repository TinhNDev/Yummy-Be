async function getAllDriverIdsFromRedis() {
    const keys = await promisify(redisClient.keys).bind(redisClient)('driver:*:location');
    return keys.map(key => key.split(':')[1]);  // Lấy id từ key driver:{id}:location
  }

  module.exports = getAllDriverIdsFromRedis;