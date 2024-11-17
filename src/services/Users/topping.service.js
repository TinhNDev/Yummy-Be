const db = require("../../models/index.model");
const Topping = db.Topping;
const { BadRequestError } = require("../../core/error.response");
class ToppingService {

  static changeStatusTopping = async ({ user_id, product_id, topping_id }) => {
    const restaurant = await db.Restaurant.findOne({
      where: { id: user_id },
      include: [
        {
          model: db.Product,
          where: { id: product_id },
          include: [
            {
              model: db.Topping,
              where: { id: topping_id },
              through: { attributes: [] }
            }
          ]
        }
      ]
    });

    if (!restaurant || !restaurant.Products || !restaurant.Products[0].Toppings) {
      throw new BadRequestError("Restaurant, Product, or Topping not found.");
    }
    const topping = restaurant.Products[0].Toppings[0];

    topping.s_available = !topping.s_available;
    await topping.save();

    return topping;
  };
  static getToppingByProduct = async (product_id) =>{
    return await db.Topping.findAll({
      include: [
        {
          model: db.Product,
          where: { id: product_id },
          attributes: [],
          through: { attributes: [] }
        }
      ]
    })
  }
}

module.exports = ToppingService;
