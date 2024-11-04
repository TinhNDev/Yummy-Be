const Redis = require('ioredis');

class RedisHelper {
    constructor(config = {}) {
        this.config = {
            host: config.host || 'localhost',
            port: config.port || 6379,
            password: config.password || null,
            db: config.db || 0,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        };

        this.client = null;
    }

    // Kết nối tới Redis
    async connect() {
        try {
            this.client = new Redis(this.config);
            
            this.client.on('error', (err) => {
                console.error('Redis Error:', err);
            });

            this.client.on('connect', () => {
                console.log('Redis connected successfully');
            });

            return this.client;
        } catch (error) {
            console.error('Redis connection error:', error);
            throw error;
        }
    }

    // Đóng kết nối
    async disconnect() {
        if (this.client) {
            await this.client.quit();
            this.client = null;
        }
    }

    // Set một giá trị với thời gian hết hạn (ttl tính bằng giây)
    async set(key, value, ttl = null) {
        try {
            if (ttl) {
                await this.client.setex(key, ttl, JSON.stringify(value));
            } else {
                await this.client.set(key, JSON.stringify(value));
            }
            return true;
        } catch (error) {
            console.error('Redis SET error:', error);
            throw error;
        }
    }

    // Lấy giá trị
    async get(key) {
        try {
            const value = await this.client.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Redis GET error:', error);
            throw error;
        }
    }

    // Xóa một hoặc nhiều key
    async delete(...keys) {
        try {
            return await this.client.del(keys);
        } catch (error) {
            console.error('Redis DELETE error:', error);
            throw error;
        }
    }

    // Kiểm tra key tồn tại
    async exists(key) {
        try {
            return await this.client.exists(key);
        } catch (error) {
            console.error('Redis EXISTS error:', error);
            throw error;
        }
    }

    // Set nhiều cặp key-value cùng lúc
    async mset(pairs) {
        try {
            const args = [];
            for (const [key, value] of Object.entries(pairs)) {
                args.push(key, JSON.stringify(value));
            }
            return await this.client.mset(args);
        } catch (error) {
            console.error('Redis MSET error:', error);
            throw error;
        }
    }

    // Lấy nhiều giá trị cùng lúc
    async mget(...keys) {
        try {
            const values = await this.client.mget(keys);
            return values.map(value => value ? JSON.parse(value) : null);
        } catch (error) {
            console.error('Redis MGET error:', error);
            throw error;
        }
    }
}

module.exports = RedisHelper;