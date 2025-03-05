const RedisHelper = require("../../cache/redis");

class CartService {
  static addToCart = async ({ user_id, product_id, description }) => {
    if (!user_id || typeof user_id !== "string") {
      throw new Error("Invalid user_id: must be a non-empty string.");
    }
    if (!product_id || typeof product_id !== "string") {
      throw new Error("Invalid product_id: must be a non-empty string.");
    }
    if (!description || typeof description !== "string") {
      throw new Error("Invalid description: must be a non-empty string.");
    }

    const redisKey = `cart:${user_id}`;
    const item = {
      product_id,
      description,
    };

    try {
      const redisHelper = new RedisHelper();
      await redisHelper.connect();

      const existingItems = (await redisHelper.get(redisKey)) || [];
      existingItems.push(item);
      await redisHelper.set(redisKey, existingItems);

      const listItem = await redisHelper.get(redisKey);
      await redisHelper.disconnect();
      return listItem;
    } catch (error) {
      throw error;
    }
  };

  static removeFromCart = async ({ user_id, product_id }) => {
    // Validate input
    if (!user_id || typeof user_id !== "string") {
      throw new Error("Invalid user_id: must be a non-empty string.");
    }
    if (!product_id || typeof product_id !== "string") {
      throw new Error("Invalid product_id: must be a non-empty string.");
    }

    const redisKey = `cart:${user_id}`;

    try {
      const redisHelper = new RedisHelper();
      await redisHelper.connect();

      // Fetch existing items
      const existingItems = (await redisHelper.get(redisKey)) || [];

      const updatedItems = existingItems.filter(
        (item) => item.product_id !== product_id
      );

      await redisHelper.set(redisKey, updatedItems);

      const listItem = await redisHelper.get(redisKey);
      await redisHelper.disconnect();
      return listItem;
    } catch (error) {
      throw error;
    }
  };

  static getItemInCart = async ({ user_id }) => {
    if (!user_id || typeof user_id !== "string") {
      throw new Error("Invalid user_id: must be a non-empty string.");
    }

    const redisKey = `cart:${user_id}`;

    try {
      const redis = new RedisHelper();
      await redis.connect();
      const item = redis.get(redisKey);
      return item ? item : [];
    } catch (error) {
      throw error;
    }
  };
}

module.exports = CartService;
