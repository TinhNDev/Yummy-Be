const db = require("../../models/index.model");
const Topping = db.Topping;
const { BadRequestError } = require("../../core");
class ToppingService {
  static createTopping = async (data) => {
    const { name, price, is_avalible } = data;
    const newTopping = Topping.create({
      name: name,
      price: price,
      is_avalible: is_avalible,
    });
    return newTopping;
  };

  static updateTopping = async (toppingId, payload) => {
    const [updated] = await Topping.update(payload, {
      where: { id: toppingId },
    });
    if (updated) {
      const updateTopping = await Topping.findOne({ where: { id: toppingId } });
      return updateTopping;
    }
    return new BadRequestError(`update failed`);
  };
}

module.exports = ToppingService;
