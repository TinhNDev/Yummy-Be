const { SuccessResponse } = require("../../../core/success.response")
const CartService = require("../../../services/Users/Customers/cart.service")
class CartController{
    AddToCart = async (req, res, next) =>{
        new SuccessResponse({
            message:" add to cart sussecc",
            metadata: await CartService.AddToCart({
                customer_id: req.user.user_id,
                product_id: req.body.product_id,
                quantity: req.body.quantity,
            })
        }).send(res);
    }
}

module.exports = new CartController();