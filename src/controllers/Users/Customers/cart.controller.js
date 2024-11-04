<<<<<<< HEAD
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

=======
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

>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
module.exports = new CartController();