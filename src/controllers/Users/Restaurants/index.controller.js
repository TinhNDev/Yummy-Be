const { SuccessResponse } = require("../../../core/success.response")
const OrderRestaunrantService = require("../../../services/Users/Restaurants/index.service")

class OrderRestaunrantController{
    getOrder = async(req,res,next) =>{
        new SuccessResponse({
            message:"all order",
            metadata: await OrderRestaunrantService.getOrder({
                restaurant_id: req.user.user_id,
                date: req.date
            })
        }).send(res)
    }
    changeStatusOrder = async(req, res)=>{
        new SuccessResponse({
            message:"change status",
            metadata: await OrderRestaunrantService.changeStatusOrder({
                restaurant_id:req.user.user_id,
                orderId: req.body.orderId,
                status: req.body.status
            })
        }).send(res)
    }
    findDriver = async(req, res) =>{
        new SuccessResponse({
            message:"driver",
            metadata: await OrderRestaunrantService.findDriver({
                restaurant_id: req.user.user_id,
                order_id: req.params.order_id,
            })
        }).send(res)
    }
    rejectOrder = async(req, res) =>{
        new SuccessResponse({
            message:"reject order",
            metadata: await OrderRestaunrantService.rejectOrderByRestaurant({
                restaurant_id: req.user.user_id,
                order_id: req.params.order_id,
                reason: req.params.reason,
            })
        }).send(res);
    }

    getCateOfRes = async(req, res) => {
        new SuccessResponse({
            message: await OrderRestaunrantService.getCateOfRes({
                restaurant_id: req.params.restaurant_id,
                category_id: req.params.category_id,
            })
        }).send(res)
    }
}

module.exports =new OrderRestaunrantController();