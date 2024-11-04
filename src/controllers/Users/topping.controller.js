const { SuccessResponse } = require("../../core/success.response")
const ToppingService = require("../../services/Users/topping.service")

class ToppingController{
    getToppingByProduct = async (req,res,next) =>{
        new SuccessResponse({
            message: "list topping",
            metadata: await ToppingService.getToppingByProduct(req.params.id)
        }).send(res)
    }
}

module.exports = new ToppingController();