const db = require("../../models/index.model");
const RedisHelper = require("../../caches/redis");

class CategoriesService {
  constructor() {
    this.redis = new RedisHelper({ keyPrefix: 'shop:' });
    this.redisKeyTTL = 3600; // Thời gian sống của cache
  }

  async initRedis() {
    await this.redis.connect();
  }

  async getProductsFromDB(categories_id) {
    const query = `
      SELECT
        c.id as categoryId,
        c.name as categoryName,
        p.id as productId,
        p.name as productName,
        p.descriptions as productDescription,
        p.price as productPrice,
        p.quantity as productQuantity,
        p.image as image,
        p.restaurant_id as restaurant_id
      FROM products p
      JOIN \`product categories\` pc ON p.id = pc.productId
      JOIN categories c ON c.id = pc.categoryId
      WHERE c.id = :categories_id;
    `;
    return await db.sequelize.query(query, {
      replacements: { categories_id },
      type: db.Sequelize.QueryTypes.SELECT,
      raw: true,
    });
  }

  formatCategoryData(result) {
    if (!result.length) return null;

    return {
      categoryId: result[0].categoryId,
      categoryName: result[0].categoryName,
      products: result.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        productDescription: item.productDescription,
        productPrice: item.productPrice,
        productQuantity: item.productQuantity,
        productImage: item.image,
        restaurantId: item.restaurant_id,
      })),
    };
  }

  async getProduct(categories_id) {
    const redisKey = `category:${categories_id}:products`;
    
    const cacheData = await this.redis.get(redisKey);
    if (cacheData) {
      return cacheData;
    } else {
      const result = await this.getProductsFromDB(categories_id);
      const formattedData = this.formatCategoryData(result);
      await this.redis.set(redisKey, formattedData, this.redisKeyTTL);
      return formattedData;
    }
  }

  static getProductByCategoryId = async (categories_id) => {
    const categorieService = new CategoriesService();
    await categorieService.initRedis();
    try {
      const product = await categorieService.getProduct(categories_id);
      return product;
    } catch (error) {
      console.error("Error fetching products by category ID:", error);
      throw error;
    } finally {
      await categorieService.redis.disconnect();
    }
  };

  static createCategories = async (categories) => {
    return await db.Categories.create({
      name: categories.name,
      thumpnail: categories.thumpnail,
      description: categories.description,
    });
  };

  static getAllCategories = async () => {
    return await db.Categories.findAll();
  };

  static getCategoriesByProduct = async (product_id) => {
    return await db.Categories.findAll({
      include: [
        {
          model: db.Product,
          where: { id: product_id },
          attributes: [],
          through: { attributes: [] },
        },
      ],
    });
  };
}

module.exports = CategoriesService;
