const { SuccessResponse } = require("../../../core/success.response")
const DriverService = require("../../../services/Users/Drivers")

class DriverController{
    updateInformation = async(req, res) =>{
        new SuccessResponse({
            message:"update successfuly",
            metadata: await DriverService.updateInformation({
                user_id:req.user.user_id,
                body: req.body.driver
            })
        }).send(res)
    }
    getProfileDriver = async(req,res) =>{
        new SuccessResponse({
            message:"profile driver",
            metadata: await DriverService.getProfileDriver({
                user_id:req.user.user_id,
            })
        }).send(res)
    }
    rejectOrder = async(req, res)=>{
        new SuccessResponse({
            message:" reject order",
            metadata: await DriverService.rejectOrder({
                driver_id: req.user.user_id,
                order_id : req.params.orderId,
            })
        }).send(res)
    }
    acceptOrder = async(req,res)=>{
        new SuccessResponse({
            message:"accept order",
            metadata: await DriverService.acceptOrder({
                driver_id:req.user.user_id,
                order_id: req.params.orderId,
            })
        }).send(res)
    }
    confirmOrder = async(req,res) =>{
        new SuccessResponse({
            message: "confirm order",
            metadata: await DriverService.confirmOrder({
                driver_id:req.user.user_id,
                order_id: req.params.orderId,
            })
        }).send(res)
    }
    getAllOrderForDriver = async(req, res)=>{
        new SuccessResponse({
            message: "full order",
            metadata: await DriverService.getAllOrderForDriver({
                date: req.body.date,
                driver_id:req.user.user_id,
            })
        }).send(res);
    }
    changeStatus = async(req,res)=>{
        new SuccessResponse({
            message:"ok",
            metadata: await DriverService.changeStatus({
                driver_id: req.params.driver_id
            })
        }).send(res)
    }
    giveOrder = async(req,res) =>{
        new SuccessResponse({
            message:"ok",
            metadata: await DriverService.giveOrder({
                driver_id:req.user.user_id,
                order_id: req.params.orderId,
            })
        }).send(res)
    }
    getDetailToHis = async(req,res) =>{
        new SuccessResponse({
            message:"detail",
            metadata: await DriverService.getDetailToHis({
                driver_id: req.params.driver_id
            })
        }).send(res)
    }
}

module.exports = new DriverController();