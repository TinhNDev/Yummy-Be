const redis = require('redis');
const redisClient = redis.createClient();
async function getAllDriverIdsFromRedis() {
    try {
        if (!redisClient.isOpen) {
            console.log('Connecting to Redis...');
            await redisClient.connect();
            console.log('Connected to Redis');
        }

        console.log('Fetching keys with pattern "driver:*:location"...');
        
        const keys = await redisClient.keys('driver:*:location');  // No promisify needed for Redis v4+
        
        console.log('Keys retrieved:', keys);
        return keys.map(key => key.split(':')[1]);
    } catch (error) {
        console.error('Error in getAllDriverIdsFromRedis:', error.message, error.stack);
    }
}

module.exports = getAllDriverIdsFromRedis;
