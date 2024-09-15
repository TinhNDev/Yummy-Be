const db = require("../../models/index.model");
const Categories = db.Categories;
class CatergoriesService {
  static createCategories = async (data) => {
    const { name, description } = data;
    const newCatergories = await Categories.create({
      name: name,
      description: description,
    });
    return newCatergories;
  };
  findCatergoriesById = async (productId) => {
    return await Categories.findOne({ where: { id: productId } });
  };
}

module.exports = CatergoriesService;
