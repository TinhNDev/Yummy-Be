const db = require("../../models/index.model.js");
const { findRestauranByKeyWord } = require("./repositories/restaurant.repo.js");
const Restaurants = db.Restaurant;
const Profile = db.Profile;
class RestaurantService {
  static updateRestaurant = async ({ restaurant_id, restaurant }) => {
    if (!restaurant?.name && !restaurant.image && !restaurant.address) {
      throw new Error("the restaurant is not valid");
    }
    const existingRestaurant = await Restaurants.findOne({
      where: { id: restaurant_id },
    });

    if (existingRestaurant) {
      await existingRestaurant.update({
        name: restaurant.name,
        image: restaurant.image,
        address: restaurant.address,
        user_id: restaurant_id,
      });
      return existingRestaurant;
    } else {
      const newRestaurant = await Restaurants.create({
        id: restaurant_id,
        name: restaurant.name,
        image: restaurant.image,
        address: restaurant.address,
        user_id: restaurant_id,
      });
      return newRestaurant;
    }
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

  static searchRestaurantByKeyWord = async (keySearch) => {
    return await findRestauranByKeyWord(keySearch);
  };

  static deleteRestaurant = async ({ restaurant_id }) => {
    return await Restaurants.update({
      status: "unactive",
      where: { id: restaurant_id },
    });
  };
}

module.exports = RestaurantService;
