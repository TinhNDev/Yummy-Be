const redis = require("redis");

class RedisHelper {
  constructor(config = {}) {
    this.config = {
      password: "CfbiVj75pXOSlwoLF9I1PRn7WzSkjWsY",
      socket: {
        host: "redis-18508.c98.us-east-1-4.ec2.redns.redis-cloud.com",
        port: 18508,
      },
    };

    this.client = null;
  }

  // Kết nối tới Redis
  async connect() {
    try {
      this.client = redis.createClient(this.config);

      // Add error handling
      this.client.on("error", (err) => {
        console.error("Redis Error:", err);
      });

      // Ensure connection using the 'connect' method of the client
      await this.client.connect();
      console.log("Redis connected successfully");

      return this.client;
    } catch (error) {
      console.error("Redis connection error:", error);
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
      if (!this.client || !this.client.isOpen) {
        throw new Error("Redis client is not connected");
      }
      if (ttl) {
        await this.client.setEx(key, ttl, JSON.stringify(value)); // setex equivalent in redis v4.x
      } else {
        await this.client.set(key, JSON.stringify(value));
      }
      return true;
    } catch (error) {
      console.error("Redis SET error:", error);
      throw error;
    }
  }

  // Cập nhật phương thức GET để hỗ trợ hGetAll cho các kiểu dữ liệu hash
  async get(key) {
    try {
      if (!this.client || !this.client.isOpen) {
        throw new Error("Redis client is not connected");
      }

      const type = await this.client.type(key);
      if (type === "hash") {
        const value = await this.client.hGetAll(key);
        return value;
      } else if (type === "string") {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
      }

      throw new Error(`Unsupported data type: ${type}`);
    } catch (error) {
      console.error("Redis GET error:", error);
      throw error;
    }
  }

  // Xóa một hoặc nhiều key
  async delete(...keys) {
    try {
      if (!this.client || !this.client.isOpen) {
        throw new Error("Redis client is not connected");
      }
      return await this.client.del(keys);
    } catch (error) {
      console.error("Redis DELETE error:", error);
      throw error;
    }
  }

  // Kiểm tra key tồn tại
  async exists(key) {
    try {
      if (!this.client || !this.client.isOpen) {
        throw new Error("Redis client is not connected");
      }
      return await this.client.exists(key);
    } catch (error) {
      console.error("Redis EXISTS error:", error);
      throw error;
    }
  }

  // Set nhiều cặp key-value cùng lúc
  async mset(pairs) {
    try {
      if (!this.client || !this.client.isOpen) {
        throw new Error("Redis client is not connected");
      }
      const args = [];
      for (const [key, value] of Object.entries(pairs)) {
        args.push(key, JSON.stringify(value));
      }
      return await this.client.mSet(args); // mset equivalent in redis v4.x
    } catch (error) {
      console.error("Redis MSET error:", error);
      throw error;
    }
  }

  // Lấy nhiều giá trị cùng lúc
  async mget(...keys) {
    try {
      if (!this.client || !this.client.isOpen) {
        throw new Error("Redis client is not connected");
      }
      const values = await this.client.mGet(keys); // mget equivalent in redis v4.x
      return values.map((value) => (value ? JSON.parse(value) : null));
    } catch (error) {
      console.error("Redis MGET error:", error);
      throw error;
    }
  }
}

module.exports = RedisHelper;
