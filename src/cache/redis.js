const { createClient } = require('redis');
const dotenv = require('dotenv');

// Load biến môi trường từ tệp .env
dotenv.config();

class RedisHelper {
  constructor() {
    const password = process.env.REDIS_PASSWORD
      ? `:${process.env.REDIS_PASSWORD}@`
      : '';
    const host = process.env.REDIS_HOST || '127.0.0.1';
    const port = process.env.REDIS_PORT || 6379;

    // Tạo URL kết nối Redis
    this.url = `redis://${password}${host}:${port}`;
    this.client = null;
  }

  // Kết nối tới Redis
  async connect() {
    try {
      this.client = createClient({ url: this.url });

      // Xử lý lỗi kết nối
      this.client.on('error', (err) => {
        console.error('Redis Error:', err);
      });

      // Đảm bảo kết nối
      await this.client.connect();
      console.log('Redis connected successfully');

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
      console.log('Redis disconnected successfully');
    }
  }
  // Lấy danh sách các key theo pattern
  async keys(pattern) {
    try {
      if (!this.client || !this.client.isOpen) {
        throw new Error('Redis client is not connected');
      }

      const keys = await this.client.keys(pattern);
      return keys;
    } catch (error) {
      console.error('Redis KEYS error:', error);
      throw error;
    }
  }

  // Set một giá trị với thời gian hết hạn (TTL tính bằng giây)
  async set(key, value, ttl = null) {
    try {
      if (!this.client || !this.client.isOpen) {
        throw new Error('Redis client is not connected');
      }
      if (ttl) {
        await this.client.setEx(key, ttl, JSON.stringify(value));
      } else {
        await this.client.set(key, JSON.stringify(value));
      }
      console.log(`Key "${key}" set successfully`);
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      throw error;
    }
  }

  // Lấy giá trị
  async get(key) {
    try {
      if (!this.client || !this.client.isOpen) {
        throw new Error('Redis client is not connected');
      }

      const type = await this.client.type(key);
      if (type === 'hash') {
        const value = await this.client.hGetAll(key);
        return value;
      } else if (type === 'string' || typeof key === 'string') {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
      }

      throw new Error(`Unsupported data type: ${type}`);
    } catch (error) {
      console.error('Redis GET error:', error);
      throw error;
    }
  }

  // Xóa một hoặc nhiều key
  async delete(...keys) {
    try {
      if (!this.client || !this.client.isOpen) {
        throw new Error('Redis client is not connected');
      }
      const result = await this.client.del(keys);
      console.log(`Keys "${keys}" deleted successfully`);
      return result;
    } catch (error) {
      console.error('Redis DELETE error:', error);
      throw error;
    }
  }

  // Kiểm tra key có tồn tại hay không
  async exists(key) {
    try {
      if (!this.client || !this.client.isOpen) {
        throw new Error('Redis client is not connected');
      }
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      throw error;
    }
  }

  // Set nhiều cặp key-value cùng lúc
  async mset(pairs) {
    try {
      if (!this.client || !this.client.isOpen) {
        throw new Error('Redis client is not connected');
      }
      const args = [];
      for (const [key, value] of Object.entries(pairs)) {
        args.push(key, JSON.stringify(value));
      }
      await this.client.mSet(args);
      console.log('Multiple keys set successfully');
      return true;
    } catch (error) {
      console.error('Redis MSET error:', error);
      throw error;
    }
  }

  // Lấy nhiều giá trị cùng lúc
  async mget(...keys) {
    try {
      if (!this.client || !this.client.isOpen) {
        throw new Error('Redis client is not connected');
      }
      const values = await this.client.mGet(keys);
      return values.map((value) => (value ? JSON.parse(value) : null));
    } catch (error) {
      console.error('Redis MGET error:', error);
      throw error;
    }
  }
}

module.exports = RedisHelper;
