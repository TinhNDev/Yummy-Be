<<<<<<< HEAD
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

=======
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

>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
module.exports = new ToppingController();