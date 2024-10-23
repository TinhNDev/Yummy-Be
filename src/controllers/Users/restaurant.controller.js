const { SuccessResponse } = require("../../core/success.response")
const restaurantService = require("../../services/Users/restaurant.service")

//select location
class RestaurantController{
    createRestaurant = async(req,res,next)=>{
        new SuccessResponse({
            message:"create restaurant success",
            metadata: await restaurantService.createRestaurant({
                restaurant_id: req.user.user_id,
                restaurant:req.body
            })
        }).send(res);
    }
    
    updateRestaurant = async(req,res,next)=>{
        new SuccessResponse({
            message:"update restaurant succsess",
            metadata: await restaurantService.updateRestaurant(
                
            )
        }).send(res)
    }

    findRestaurantById = async(req,res,next)=>{
        new SuccessResponse({
            message:"",
            metadata: await restaurantService.findRestaurantById
        })
    }


}
module.exports = RestaurantController();