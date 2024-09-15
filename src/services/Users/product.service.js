const db = require("../../models/index.model");
const Products = db.Product;
const Categories = db.Categories;
const Topping = db.Topping;

const { updateProductById } = require("./repositories/product.repo");

class Product {
  constructor({ name, image, description, price, quantity, is_available }) {
    this.name = name;
    this.image = image;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.is_available = is_available;
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
  static createProduct = async (categoriesId, toppingId, payload) => {
    if (!payload) {
      throw new Error("Payload is required to create a product");
    }

    const { name, image, description, price, quantity, is_available } = payload;

    const newProductInstance = new Product({
      name,
      image,
      description,
      price,
      quantity,
      is_available,
    });

    const newProduct = await newProductInstance.createProduct();

    if (categoriesId && categoriesId.length > 0) {
      const categories = await Categories.findAll({
        where: { id: categoriesId },
      });
      await newProduct.addCategories(categories);
    }

    if (toppingId && toppingId.length > 0) {
      const toppings = await Topping.findAll({
        where: { id: toppingId },
      });
      await newProduct.addToppings(toppings);
    }

    return newProduct;
  };

  static updateProduct = async (product_id, payload) => {
    const { name, image, description, price, quantity, is_available } = payload;
    const updateProductInstance = new Product({
      name,
      image,
      description,
      price,
      quantity,
      is_available,
    });
    return await updateProductInstance.updateProduct(product_id);
  };

  static searchProducts = async (payload) => {
    const {} = payload;
    
  }
}

module.exports = ProductService;
