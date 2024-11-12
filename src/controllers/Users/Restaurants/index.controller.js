const { SuccessResponse } = require("../../../core/success.response")
const OrderRestaunrantService = require("../../../services/Users/Restaurants/index.service")

class OrderRestaunrantController{
    getOrder = async(req,res,next) =>{
        new SuccessResponse({
            message:"all order",
            metadata: await OrderRestaunrantService.getOrder({
                restaurant_id: req.user.user_id
            })
        }).send(res)
    }
}

module.exports =new OrderRestaunrantController();