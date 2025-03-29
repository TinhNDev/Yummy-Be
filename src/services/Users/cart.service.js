const RedisHelper = require("../../cache/redis");

class CartService {
  static addToCart = async ({ user_id, product_id, description }) => {
    if (!user_id) {
      throw new Error("Invalid user_id: must be a non-empty.");
    }
    if (!product_id) {
      throw new Error("Invalid product_id: must be a non-empty.");
    }
    if (!description) {
      throw new Error("Invalid description: must be a non-empty string.");
    }
    const redisKey = `cart:${user_id}`;
    const cart_item_id = `${product_id}-${JSON.stringify(description.toppings || [])}`;
    
    try {
      const redisHelper = new RedisHelper();
      await redisHelper.connect();
  
      let existingItems = JSON.parse((await redisHelper.get(redisKey)) || "[]");
      if (description.quantity === 0) {
        existingItems = existingItems.filter(item => item.cart_item_id !== cart_item_id);
      } else {
        const existingItemIndex = existingItems.findIndex(item => item.cart_item_id === cart_item_id);
        
        const item = {
          product_id,
          description,
          cart_item_id,
        };
        
        if (existingItemIndex !== -1) {
          existingItems[existingItemIndex] = item;
        } else {
          existingItems.push(item);
        }
      }
      
      await redisHelper.set(redisKey, JSON.stringify(existingItems));
  
      const items = JSON.parse((await redisHelper.get(redisKey)) || "[]");
  
      await redisHelper.disconnect();
      return items;
    } catch (error) {
      throw error;
    }
  };

  static getItemInCart = async ({ user_id }) => {
    if (!user_id) {
      throw new Error("Invalid user_id: must be a non-empty string.");
    }
  
    const redisKey = `cart:${user_id}`;
  
    try {
      const redis = new RedisHelper();
      await redis.connect();
  
      const items = JSON.parse((await redis.get(redisKey)) || "[]");
  
  
      await redis.disconnect();
      return items;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = CartService;