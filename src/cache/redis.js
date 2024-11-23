const redis = require('redis');

class RedisHelper {
    constructor(config = {}) {
        this.config = {
            password: 'CfbiVj75pXOSlwoLF9I1PRn7WzSkjWsY',
            socket: {
                host: 'redis-18508.c98.us-east-1-4.ec2.redns.redis-cloud.com',
                port: 18508
            },
            connect_timeout: 10000,
        };

        this.client = null;
        this.isConnecting = false;
        this.connectionPromise = null;
    }

    async ensureConnection() {
        if (this.client?.isOpen) {
            return this.client;
        }

        if (this.isConnecting) {
            return this.connectionPromise;
        }

        return this.connect();
    }

    async connect() {
        if (this.isConnecting) {
            return this.connectionPromise;
        }

        this.isConnecting = true;
        this.connectionPromise = new Promise(async (resolve, reject) => {
            try {
                if (this.client?.isOpen) {
                    this.isConnecting = false;
                    return resolve(this.client);
                }

                // Create new client if none exists or previous one was closed
                this.client = redis.createClient(this.config);

                this.client.on('error', (err) => {
                    console.error('Redis Error:', err);
                });

                this.client.on('connect', () => {
                    console.log('Redis connected successfully');
                });

                this.client.on('timeout', () => {
                    console.error('Redis connection timed out');
                });

                // Handle reconnection events
                this.client.on('reconnecting', () => {
                    console.log('Redis reconnecting...');
                });

                this.client.on('end', () => {
                    console.log('Redis connection ended');
                });

                await this.client.connect();
                this.isConnecting = false;
                resolve(this.client);
            } catch (error) {
                this.isConnecting = false;
                this.client = null;
                console.error('Redis connection error:', error);
                reject(error);
            }
        });

        return this.connectionPromise;
    }

    async disconnect() {
        if (this.client) {
            await this.client.quit();
            this.client = null;
            this.connectionPromise = null;
            this.isConnecting = false;
        }
    }

    async set(key, value, ttl = null) {
        try {
            await this.ensureConnection();
            
            // Kiểm tra nếu value đã là string thì không stringify nữa
            const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
            
            if (ttl) {
                await this.client.setEx(key, ttl, valueToStore);
            } else {
                await this.client.set(key, valueToStore);
            }
            return true;
        } catch (error) {
            console.error('Redis SET error:', error);
            throw error;
        }
    }

    async get(key) {
        try {
            await this.ensureConnection();
            const value = await this.client.get(key);
            if (!value) return null;
            
            try {
                return JSON.parse(value);
            } catch (e) {
                // Nếu parse fail thì trả về nguyên giá trị
                return value;
            }
        } catch (error) {
            console.error('Redis GET error:', error);
            throw error;
        }
    }

    async delete(...keys) {
        try {
            await this.ensureConnection();
            return await this.client.del(keys);
        } catch (error) {
            console.error('Redis DELETE error:', error);
            throw error;
        }
    }

    async exists(key) {
        try {
            await this.ensureConnection();
            return await this.client.exists(key);
        } catch (error) {
            console.error('Redis EXISTS error:', error);
            throw error;
        }
    }

    async mset(pairs) {
        try {
            await this.ensureConnection();
            const args = [];
            for (const [key, value] of Object.entries(pairs)) {
                args.push(key, JSON.stringify(value));
            }
            return await this.client.mSet(args);
        } catch (error) {
            console.error('Redis MSET error:', error);
            throw error;
        }
    }

    async mget(...keys) {
        try {
            await this.ensureConnection();
            const values = await this.client.mGet(keys);
            return values.map(value => value ? JSON.parse(value) : null);
        } catch (error) {
            console.error('Redis MGET error:', error);
            throw error;
        }
    }
}

module.exports = RedisHelper;