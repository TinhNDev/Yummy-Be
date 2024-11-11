const { SuccessResponse } = require("../../core/success.response");
const restaurantService = require("../../services/Users/restaurant.service");
class RestaurantController {
  updateRestaurant = async (req, res, next) => {
    new SuccessResponse({
      message: "create restaurant success",
      metadata: await restaurantService.updateRestaurant({
        restaurant_id: req.user.user_id,
        restaurant: req.body.restaurant,
      }),
    }).send(res);
  };

  activeRestaurant = async (req, res, next) => {
    new SuccessResponse({
      message: "active restaurant success",
      metadata: await restaurantService.activeRestaurant({
        restaurant_id: req.body.restaurant_id,
      }),
    }).send(res);
  };

  getDetailProRes = async (req, res, next) => {
    new SuccessResponse({
      message: "res detail",
      metadata: await restaurantService.getDetailProRes({
        restaurant_id: req.user.user_id,
      }),
    }).send(res);
  };
  getRestaurantPending = async (req, res, next) => {
    new SuccessResponse({
      message: " list pending res",
      metadata: await restaurantService.getRestaurantPending(),
    }).send(res);
  };

  getAllRestaurant = async (req, res, next) => {
    new SuccessResponse({
      message: "list restaurant",
      metadata: await restaurantService.getAllRestaurant(req.params.userLatitude, req.params.userLongitude),
    }).send(res);
  };

  deleteRestaurant = async (req, res, next) => {
    new SuccessResponse({
      message: "delete success",
      metadata: await restaurantService.deleteRestaurant({
        restaurant_id: req.body.restaurant_id,
      }),
    });
  };
}
module.exports = new RestaurantController();
