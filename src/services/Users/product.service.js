const db = require('../../models/index.model');
const Products = db.Product;
const Categories = db.Categories;
const Topping = db.Topping;
const RedisHelper = require('../../cache/redis');
const {
  updateProductById,
  publishedProductByRestaurant,
  draftProductByRestaurant,
  findAllDraftsForShop,
  findAllProduct,
  findProduct,
  findProductByUser,
  findAllPublicForShop,
  getProductByRestaurantId,
  resgetProductByRestaurantId,
  resgetProductByRestaurantIdForUser,
} = require('./repositories/product.repo');

class Product {
  constructor({
    name,
    image,
    descriptions,
    price,
    quantity,
    is_available,
    restaurant_id,
    is_public,
    is_draft,
  }) {
    this.name = name;
    this.image = image;
    this.descriptions = descriptions;
    this.price = price;
    this.quantity = quantity;
    this.is_available = is_available;
    this.restaurant_id = restaurant_id;
    this.is_public = is_public;
    this.is_draft = is_draft;
  }

  async createProduct() {
    return await Products.create({ ...this });
  }

  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({
      productId,
      bodyUpdate,
      model: Products,
    });
  }
}

class ProductService extends Product {
  static async initRedis() {
    const redis = new RedisHelper({ keyPrefix: 'product:' });
    await redis.connect();
    return redis;
  }
  static createProduct = async (categoriesId, toppingData, productData) => {
    if (!productData) {
      throw new Error('Payload is required to create a product');
    }
    const restaurant = await db.Restaurant.findOne({
      where: { user_id: productData.user_id },
    });
    const { name, image, descriptions, price, quantity, is_available } =
      productData.productData;
    const newProductInstance = new Product({
      name,
      image,
      descriptions,
      price,
      quantity,
      is_available,
      is_public: false,
      is_draft: true,
      restaurant_id: restaurant.id,
    });

    const newProduct = await newProductInstance.createProduct();

    if (categoriesId) {
      const categories = await Categories.findAll({
        where: {
          id: categoriesId,
        },
      });
      await newProduct.addCategories(categories);
    }

    if (toppingData) {
      const toppings = await Promise.all(
        toppingData.map(async (data) => await Topping.create(data))
      );
      await newProduct.addToppings(toppings);
    }

    return newProduct;
  };

  static updateProduct = async (
    product_id,
    categoriesId,
    toppingData,
    payload
  ) => {
    const { name, image, descriptions, price, quantity, is_available } =
      payload.productData;
    const updateProductInstance = new Product({
      name,
      image,
      descriptions,
      price,
      quantity,
      is_available,
    });
    await updateProductInstance.updateProduct(product_id, {
      name,
      image,
      descriptions,
      price,
      quantity,
      is_available,
    });

    if (categoriesId) {
      const categories = await Categories.findAll({
        where: {
          id: categoriesId,
        },
      });
      let product = await Products.findOne({
        where: { id: parseInt(product_id) },
      });
      await product.setCategories(categories);
    }
    if (toppingData && toppingData.length > 0) {
      const product = await Products.findByPk(product_id, {
        include: [
          {
            model: Topping,
            attributes: ['id'],
          },
        ],
      });

      const currentToppings = product.Toppings;
      await Promise.all(
        toppingData.map(async (data, index) => {
          const currentTopping = currentToppings[index];
          if (currentTopping) {
            await Topping.update(
              {
                topping_name: data.topping_name,
                price: data.price,
                is_available: data.is_available,
              },
              {
                where: { id: currentTopping.dataValues.id },
              }
            );
          } else {
            let topping = await Topping.create({
              topping_name: data.topping_name,
              is_available: data.is_available,
              price: data.price,
            });
            await product.addToppings(topping);
          }
        })
      );
    }

    return await Products.findByPk(product_id);
  };

  static async publishedProductByRestaurant({ product_id }) {
    return publishedProductByRestaurant({ product_id });
  }
  static async draftProductByRestaurant({ product_id }) {
    return draftProductByRestaurant({ product_id });
  }

  static async findAllDraftsForRestaurant({
    product_restaurant,
    limit = 60,
    skip = 0,
  }) {
    const query = {
      restaurant_id: product_restaurant,
      is_draft: true,
    };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublicForRestaurant({
    product_restaurant,
    limit = 60,
    skip = 0,
  }) {
    const query = {
      restaurant_id: product_restaurant,
      is_public: true,
    };
    return await findAllPublicForShop({ query, limit, skip });
  }
  static async getListSearchProduct(keySearch) {
    return await findProductByUser(keySearch);
  }
  static async findAllProduct({
    limit = 30,
    sort = 'ctime',
    page = 1,
    filter,
  }) {
    return await findAllProduct({
      limit,
      sort,
      page,
      filter,
      select: [
        'id',
        'name',
        'image',
        'price',
        'restaurant_id',
        'is_public',
        'is_draft',
      ],
    });
  }
  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ['__v'] });
  }
  static async getListProductForRes({ restaurant_id }) {
    return await resgetProductByRestaurantId({ restaurant_id });
  }
  static async resgetProductByRestaurantIdForUser({ restaurant_id }) {
    return await resgetProductByRestaurantIdForUser({ restaurant_id });
  }

  static hiddenProduct = async ({ product_id }) => {
    const product = await Products.findOne({ where: { id: product_id } });
    if (product.is_available) {
      product.is_available = false;
      return product.save();
    } else {
      product.is_available = true
      return product.save();
    };
  };
  static showProduct = async ({ product_id }) => {
    const product = await Products.findOne({ where: { id: product_id } });
    product.is_available = product.quantity > 0 ? true : false;
    return product.save();
  };
}

module.exports = ProductService;
