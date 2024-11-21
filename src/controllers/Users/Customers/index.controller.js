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
            }).send(res)
        })
    }
}

module.exports = new CustomerController();