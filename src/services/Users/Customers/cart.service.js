const { NotFoundError } = require("../../../core/error.response");
const db = require("../../../models/index.model");
const RedisHelper = require("../../../cache/redis");

class CartService {
  constructor() {
    this.redis = new RedisHelper({ keyPrefix: 'shop:' });
    this.redisKeyTTL = 3600;
  }

  async initRedis() {
    await this.redis.connect();
  }

  async getProduct(productId) {
    const cacheKey = `product:${productId}`;
    let product = await this.redis.get(cacheKey);
    
    if (!product) {
      product = await db.Product.findOne({ where: { id: productId } });
      if (product) {
        const productCache = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
        };
        await this.redis.set(cacheKey, productCache, this.redisKeyTTL);
        return productCache;
      }
      return null;
    }
    return product;
  }

  async getOrCreateCustomer(customerId) {
    const cacheKey = `customer:${customerId}`;
    let customer = await this.redis.get(cacheKey);
    
    if (!customer) {
      customer = await db.Customer.findOne({ where: { id: customerId } });
      
      if (!customer) {
        const profile = await db.Profile.findOne({ where: { id: customerId } }) 
          || await db.Profile.create({ id: customerId });
        
        customer = await db.Customer.create({
          id: profile.id,
          profile_id: profile.id,
        });
      }
      
      const customerCache = { id: customer.id, profile_id: customer.profile_id };
      await this.redis.set(cacheKey, customerCache, this.redisKeyTTL);
      return customerCache;
    }
    return customer;
  }

  async getCartItems(cartId) {
    const cartKey = `cart:${cartId}:items`;
    const items = await this.redis.get(cartKey);
    return items || [];
  }

  async updateCartItems(cartId, items) {
    const cartKey = `cart:${cartId}:items`;
    await this.redis.set(cartKey, items, this.redisKeyTTL);
  }

  async getOrCreateCartMetadata(customerId) {
    const cartMetaKey = `cart:${customerId}:meta`;
    let cartMeta = await this.redis.get(cartMetaKey);
    
    if (!cartMeta) {
      cartMeta = {
        id: `cart_${customerId}_${Date.now()}`,
        customer_id: customerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        item_count: 0,
        total_amount: 0
      };
      await this.redis.set(cartMetaKey, cartMeta, this.redisKeyTTL);
    }
    
    return cartMeta;
  }

  async updateCartMetadata(customerId, updates) {
    const cartMetaKey = `cart:${customerId}:meta`;
    const cartMeta = await this.getOrCreateCartMetadata(customerId);
    const updatedMeta = {
      ...cartMeta,
      ...updates,
      updated_at: new Date().toISOString()
    };
    await this.redis.set(cartMetaKey, updatedMeta, this.redisKeyTTL);
    return updatedMeta;
  }

  calculateCartTotals(cartItems) {
    return {
      itemCount: cartItems.length,
      totalAmount: cartItems.reduce((sum, item) => sum + item.price, 0)
    };
  }

  static AddToCart = async ({ customer_id, product_id, quantity }) => {
    const cartService = new CartService();
    await cartService.initRedis();

    try {
      const product = await cartService.getProduct(product_id);
      if (!product) throw new NotFoundError("Product not found");
      if (product.quantity < quantity) throw new NotFoundError("Insufficient product quantity");

      const customer = await cartService.getOrCreateCustomer(customer_id);
      const cartMeta = await cartService.getOrCreateCartMetadata(customer.id);
      const currentItems = await cartService.getCartItems(cartMeta.id);

      const existingItemIndex = currentItems.findIndex(item => item.prod_id === product.id);
      const updatedItems = [...currentItems];
      const cartItem = {
        prod_id: product.id,
        quantity: quantity,
        price: product.price * quantity,
        updated_at: new Date().toISOString()
      };

      if (existingItemIndex > -1) {
        updatedItems[existingItemIndex] = cartItem;
      } else {
        updatedItems.push(cartItem);
      }

      await cartService.updateCartItems(cartMeta.id, updatedItems);

      const { itemCount, totalAmount } = cartService.calculateCartTotals(updatedItems);
      const updatedMeta = await cartService.updateCartMetadata(customer.id, {
        item_count: itemCount,
        total_amount: totalAmount
      });

      return {
        cart: updatedMeta,
        items: updatedItems
      };
    } finally {
      await cartService.redis.disconnect();
    }
  };

  async clearCartData(cartId, customerId) {
    const cartItemKey = `cart:${cartId}:items`;
    const cartMetaKey = `cart:${customerId}:meta`;
    
    await Promise.all([
      this.redis.delete(cartItemKey),
      this.redis.delete(cartMetaKey)
    ]);
  }

  static async persistCartToDatabase(customerId) {
    const cartService = new CartService();
    await cartService.initRedis();

    try {
      const cartMeta = await cartService.getOrCreateCartMetadata(customerId);
      const cartItems = await cartService.getCartItems(cartMeta.id);

      if (!cartItems || cartItems.length === 0) {
        throw new NotFoundError("Cart is empty");
      }

      const order = await db.Order.create({
        customer_id: customerId,
        total_amount: cartMeta.total_amount,
        item_count: cartMeta.item_count,
        listCartItem: JSON.stringify(cartItems)
      });

      await Promise.all(cartItems.map(async (item) => {
        const product = await cartService.getProduct(item.prod_id);
        return db.sequelize.query(
          `INSERT INTO \`Order Items\` (
            \`order_id\`, \`prod_id\`, \`product\`, \`quantity\`, \`price\`, \`createdAt\`, \`updatedAt\`
          ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
          {
            replacements: [
              order.id,
              item.prod_id,
              JSON.stringify(product),
              item.quantity,
              item.price
            ],
            type: db.Sequelize.QueryTypes.INSERT,
          }
        );
      }));

      await cartService.clearCartData(cartMeta.id, customerId);

      return order;
    } finally {
      await cartService.redis.disconnect();
    }
  }
}

module.exports = CartService;
