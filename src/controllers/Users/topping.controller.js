const { SuccessResponse } = require("../../core/success.response")
const ToppingService = require("../../services/Users/topping.service")

class ToppingController{
    getToppingByProduct = async (req,res,next) =>{
        new SuccessResponse({
            message: "list topping",
            metadata: await ToppingService.getToppingByProduct(req.params.id)
        }).send(res)
    }
    changeStatusTopping = async (req, res,next) =>{
        const user_id = req.user.user_id;
        new SuccessResponse({
            message: "change success",
            metadata: await ToppingService.changeStatusTopping({
                user_id: req.user.user_id,
                product_id: req.params.id,
                topping_id: req.body.topping_id,
            })
        }).send(res)
    }
}

module.exports = new ToppingController();