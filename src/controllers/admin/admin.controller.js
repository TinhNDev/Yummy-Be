const { SuccessResponse } = require("../../core/success.response")
const AdminService = require("../../services/Admin")

class AdminController{
    getAllRestaurant = async(req,res)=>{
        new SuccessResponse({
            message:"all res",
            metadata: await AdminService.getAllRestaurant()
        }).send(res)
    }
    changeStatusRes = async(req,res)=>{
        new SuccessResponse({
            message:"change success",
            metadata: await AdminService.changeStatusRestaurant(req.params.restaurant_id)
        }).send(res)
    }
    getAllDriver = async(req,res)=>{
        new SuccessResponse({
            message:"all driver",
            metadata: await AdminService.getAllDriver()
        }).send(res)
    }
    changeStatusDriver = async(req,res)=>{
        new SuccessResponse({
            message:"change",
            metadata: await AdminService.changeStatusDriver({
                driver_id: req.params.driver_id,
                status: req.body.status
            })
        }).send(res)
    }

    getDetailDriverForAdmin = async(req,res) =>{
        new SuccessResponse({
            message:"detail driver",
            metadata: await AdminService.getDetailDriverForAdmin({
                driver_id: req.params.driver_id,
            })
        })
    }
}

module.exports = new AdminController();