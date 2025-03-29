const RedisHelper = require("../../cache/redis");

class CartService {

  static groupCartItems = (items) => {
    const groupedItems = new Map();
  
    items.forEach((item) => {
      const key = `${item.product_id}-${JSON.stringify(item.description.toppings || [])}`;
  
      if (groupedItems.has(key)) {
        const existingItem = groupedItems.get(key);
        existingItem.description.quantity += item.description.quantity;
        existingItem.description.price = item.description.price * existingItem.description.quantity;
      } else {
        groupedItems.set(key, { ...item });
      }
    });
  
    return Array.from(groupedItems.values());
  };

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
    const cart_item_id = `${product_id}-${JSON.stringify(description.toppings || [])}-${Date.now()}`;
    const item = {
      product_id,
      description,
      cart_item_id
    };

    try {
      const redisHelper = new RedisHelper();
      await redisHelper.connect();

      const existingItems = JSON.parse((await redisHelper.get(redisKey)) || "[]");
      existingItems.push(item);
      await redisHelper.set(redisKey, JSON.stringify(existingItems));

      const items = JSON.parse((await redisHelper.get(redisKey)) || "[]");
      const groupedItems = CartService.groupCartItems(items);
      
      await redisHelper.disconnect();
      return groupedItems;
    } catch (error) {
      throw error;
    }
  };

  static removeFromCart = async ({ user_id, cart_item_id }) => {
    if (!user_id) {
      throw new Error("Invalid user_id: must be a non-empty string.");
    }
    if (!cart_item_id) {
      throw new Error("Invalid cart_item_id: must be a non-empty string.");
    }

    const redisKey = `cart:${user_id}`;

    try {
      const redisHelper = new RedisHelper();
      await redisHelper.connect();

      let existingItems = JSON.parse((await redisHelper.get(redisKey)) || "[]");
      
      const updatedItems = existingItems.filter(item => item.cart_item_id !== cart_item_id);
      
      if (updatedItems.length !== existingItems.length) {
        await redisHelper.set(redisKey, JSON.stringify(updatedItems));
      }

      const items = JSON.parse((await redisHelper.get(redisKey)) || "[]");
      const groupedItems = CartService.groupCartItems(items);
      
      await redisHelper.disconnect();
      return groupedItems;
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
  
      const groupedItems = CartService.groupCartItems(items);
  
      await redis.disconnect();
      return groupedItems ? groupedItems : [];
    } catch (error) {
      throw error;
    }
  };
}

module.exports = CartService;