const { SuccessResponse } = require("../../core/success.response")
const ToppingService= require("../../services/Users/topping.service")
class ToppingController{
    CreateTopping = async (req, res, next) =>{
        new SuccessResponse({
            metadata: await ToppingService.createTopping({
                user_id: req.user.user_id,
                topping: req.body.topping
            })
        })
    }
}