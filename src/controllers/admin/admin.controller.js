const { SuccessResponse } = require("../../core/success.response")
const AdminService = require("../../services/Admin")

class AdminController{
    getAllRestaurant = async(req,res)=>{
        new SuccessResponse({
            message:"all res",
            metadata: await AdminService.getAllRestaurant()
        }).send(res)
    }
}

module.exports = new AdminController();