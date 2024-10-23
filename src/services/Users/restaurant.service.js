const db = require("../../models/index.model.js");
const { findRestauranByKeyWord } = require("./repositories/restaurant.repo.js");
const Restaurants = db.Restaurant;
const Profile = db.Profile;
class RestaurantService {
  static createRestaurant = async ({ restaurant_id, restaurant }) => {
    if (!restaurant?.name && !restaurant.image && !restaurant.address) {
      throw new Error("the restaurant is not valid");
    } else {
      const cccd = Profile.findOne({
        where: { id: restaurant_id },
      });
      if (!cccd?.email) {
        throw new Error("You need verify email!");
      } else if (!cccd.cic) {
        throw new Error("You need verify cic");
      }
    }
    return await Restaurants.create({
      id: restaurant_id,
      name: restaurant.name,
      image: restaurant.image,
      address: restaurant.address,
    });
  };

  static updateRestaurant = async ({ restaurant_id, restaurant }) => {
    const Restaurant = Restaurants.findOne({
      where: { id: restaurant_id },
    });
    if (!Restaurant?.status === "active")
      throw new Error("the requiment don't accepted");
    return await Restaurants.update({
      name: restaurant.name,
      image: restaurant.image,
      address: restaurant.address,
      status: restaurant.status,
      where: { id: restaurant_id },
    });
  };

  static activeRestaurant = async ({ restaurant_id }) => {
    return await Restaurants.update({
      status: "active",
      where: { id: restaurant_id },
    });
  };

  static getRestaurantPending = async () => {
    return await Restaurants.findAll({
      where: { status: "pending" },
    });
  };

  static getAllRestaurant = async () => {
    return await Restaurants.findAll();
  };

  static searchRestaurantByKeyWord = async (keySearch) =>{
    return await findRestauranByKeyWord(keySearch)
  };

  static deleteRestaurant = async ({ restaurant_id }) => {
    return await Restaurants.update({
      status: "unactive",
      where: { id: restaurant_id },
    });
  };
}

module.exports = RestaurantService;
