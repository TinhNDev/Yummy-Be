const RedisHelper = require('../../cache/redis');
const db = require('../../models/index.model');
const _ = require('lodash');
class CartService {
  static addToCart = async ({ user_id, product_id, description }) => {
    if (!user_id) {
      throw new Error('Invalid user_id: must be a non-empty.');
    }
    if (!product_id) {
      throw new Error('Invalid product_id: must be a non-empty.');
    }
    if (!description) {
      throw new Error('Invalid description: must be a non-empty string.');
    }
    const product = await db.Product.findOne({ where: { id: product_id } });
    const redisKey = `cart:${user_id}-${product.restaurant_id}`;
    const cart_item_id = `${product_id}-${JSON.stringify(description.toppings || [])}`;

    try {
      const redisHelper = new RedisHelper();
      await redisHelper.connect();

      let existingItems = JSON.parse((await redisHelper.get(redisKey)) || '[]');
      let existingitems = existingItems.filter(
        (item) =>
          (item.cart_item_id == cart_item_id &&
            item.description.quantity + description.quantity > 0) ||
          item.cart_item_id !== cart_item_id
      );
      if (!_.isEqual(existingItems, existingitems)) {
        await redisHelper.set(redisKey, JSON.stringify(existingitems));

        const items = JSON.parse((await redisHelper.get(redisKey)) || '[]');

        await redisHelper.disconnect();
        return items;
      }
      const existingItemIndex = existingItems.findIndex(
        (item) => item.cart_item_id === cart_item_id
      );

      const item = {
        product_id,
        description,
        cart_item_id,
      };

      if (existingItemIndex !== -1) {
        existingItems[existingItemIndex].description.quantity +=
          description.quantity;
      } else {
        existingItems.push(item);
      }
      await redisHelper.set(redisKey, JSON.stringify(existingItems));

      const items = JSON.parse((await redisHelper.get(redisKey)) || '[]');

      await redisHelper.disconnect();
      return items;
    } catch (error) {
      throw error;
    }
  };

  static getItemInCart = async ({ user_id, restaurant_id }) => {
    if (!user_id) {
      throw new Error('Invalid user_id: must be a non-empty string.');
    }

    const redisKey = `cart:${user_id}-${restaurant_id}`;

    try {
      const redis = new RedisHelper();
      await redis.connect();

      const items = JSON.parse((await redis.get(redisKey)) || '[]');

      await redis.disconnect();
      return items;
    } catch (error) {
      throw error;
    }
  };

  static getAllCart = async ({ user_id }) => {
    try {
      const redisHelper = new RedisHelper();
      await redisHelper.connect();

      const keys = await redisHelper.keys(`cart:${user_id}-*`);
      const groupedCart = {};

      for (const key of keys) {
        const items = JSON.parse((await redisHelper.get(key)) || '[]');

        if (items.length > 0) {
          const restaurant_id = items[0].description.restaurant_id;

          if (!groupedCart[restaurant_id]) {
            groupedCart[restaurant_id] = {
              items: [],
              total_quantity: 0,
            };
          }

          const resDetail = await db.Restaurant.findOne({
            where: { id: restaurant_id },
          });

          for (const item of items) {
            groupedCart[restaurant_id].items.push({
              ...item,
              restaurant: resDetail,
            });
            groupedCart[restaurant_id].total_quantity += item.description.quantity || 1;
          }
        }
      }

      await redisHelper.disconnect();

      const result = Object.entries(groupedCart).map(([restaurant_id, data]) => ({
        restaurant_id: Number(restaurant_id),
        items: data.items,
        total_quantity: data.total_quantity,
      }));

      return result;
    } catch (error) {
      throw error;
    }
  };


}

module.exports = CartService;
