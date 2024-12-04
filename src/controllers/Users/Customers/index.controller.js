const { SuccessResponse } = require("../../../core/success.response")
const CustomerService = require("../../../services/Users/Customers/index.service")

class CustomerController{
    getAllOrderForCustomer = async(req,res) =>{
        new SuccessResponse({
            message:"full order of user",
            metadata: await CustomerService.getAllOrderForCustomer({
                user_id: req.user.user_id,
            })
        }).send(res)
    }
    getOrderForCustomer = async(req,res) =>{
        new SuccessResponse({
            message:"order of user",
            metadata: await CustomerService.getOrderForCustomer({
                user_id: req.user.user_id,
                order_id: req.params.order_id,
            })
        }).send(res)
    }
    getDistanceByResId = async(req,res) =>{
        new SuccessResponse({
            message:"distance",
            metadata: await CustomerService.getDistance({
                restaurant_id:req.params.restaurant_id,
                userLatitude:req.params.userLatitude,
                userLongtitude:req.params.userLongtitude
            })
        }).send(res)
    }
}

module.exports = new CustomerController();