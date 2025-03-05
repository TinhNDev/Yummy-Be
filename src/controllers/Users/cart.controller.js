const { SuccessResponse } = require("../../core/success.response");
const CartService = require("../../services/Users/cart.service");

class CartController {
  addToCart = async (req, res) => {
    const { user_id, product_id, description } = req.body;

    new SuccessResponse({
      message: "list item in cart",
      metadata: await CartService.addToCart({
        user_id,
        product_id,
        description,
      }),
    }).send(res);
  };

  removeFromCart = async (req, res) => {
    const { user_id, product_id } = req.params;

    new SuccessResponse({
      message: "update item",
      metadata: await CartService.removeFromCart({ user_id, product_id }),
    }).send(res);
  };

  getItemInCart = async (req, res) => {
    const { user_id } = req.params;
    new SuccessResponse({
      message: "list item in cart",
      metadata: await CartService.getItemInCart({ user_id }),
    }).send(res);
  };
}

module.exports = new CartController();
