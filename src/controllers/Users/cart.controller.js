const { SuccessResponse } = require("../../core/success.response");
const CartService = require("../../services/Users/cart.service");

class CartController {
  addToCart = async (req, res) => {
    const { user_id} = req.user;
    const {product_id, description } = req.body;

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
    const { user_id} = req.user;
    const {cart_item_id} = req.body

    new SuccessResponse({
      message: "update item",
      metadata: await CartService.removeFromCart({ user_id, cart_item_id}),
    }).send(res);
  };

  getItemInCart = async (req, res) => {
    const { user_id } = req.user;
    new SuccessResponse({
      message: "list item in cart",
      metadata: await CartService.getItemInCart({ user_id }),
    }).send(res);
  };
}

module.exports = new CartController();
