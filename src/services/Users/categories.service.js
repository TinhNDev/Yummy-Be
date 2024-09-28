const db = require("../../models/index.model");
const listProduct = {};
class CatergoriesService {
  static createCategories = async (categories) => {
    return await db.Categories.create({
      name: categories.name,
      thumpnail: categories.thumpnail,
      description: categories.description,
    });
  };
  static getListProduct = async () => {
    const query = `
    SELECT
    c.id as categoryId,
    c.name as categoryName,
    p.id as productId,
    p.name as productName,
    p.descriptions as productDescription,
    p.price as productPrice,
    p.quantity as productQuanlity
    FROM products p
    JOIN \`product categories\` pc ON p.id = pc.productId
    JOIN categories c ON c.id = pc.categoryId;
    `;
    const result = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
      raw: true,
    });
    result.forEach((item) => {
      listProduct[item.categoryId] = {
        categoryName: item.categoryName,
        product: [],
      };
      listProduct[item.categoryId].product.push({
        productId: item.productId,
        productName: item.productName,
        productDescription: item.productDescription,
        productPrice: item.productPrice,
        productQuantity: item.productQuantity,
      });
    });
    return listProduct;
  };

  static getProductByCategoryId = async (category_id) => {
    if (Object.keys(listProduct).length !== 0){
      return await listProduct[category_id] || [];
    }
    await this.getListProduct();
    return await listProduct[category_id] || [];   
  };
}

module.exports = CatergoriesService;
