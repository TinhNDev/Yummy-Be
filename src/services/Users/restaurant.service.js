const db = require("../../models/index.model.js");
const { findRestauranByKeyWord } = require("./repositories/restaurant.repo.js");
const Restaurants = db.Restaurant;
const Profile = db.Profile;
class RestaurantService {
  static updateRestaurant = async ({ restaurant_id, restaurant }) => {
    if (!restaurant?.name || !restaurant.image || !restaurant.address || !restaurant.opening_hours || !restaurant.phone_number || !restaurant.description) {
      throw new Error("The restaurant object contains null or invalid fields");
    }

    const existingRestaurant = await Restaurants.findOne({
      where: { id: restaurant_id },
    });

    const updateData = {
      name: restaurant.name,
      image: restaurant.image,
      address: restaurant.address,
      user_id: restaurant_id,
      opening_hours: restaurant.opening_hours,
      phone_number: restaurant.phone_number,
      description: restaurant.description,
    };

    if (existingRestaurant) {
      await existingRestaurant.update(updateData);
      return existingRestaurant;
    } else {
      const newRestaurant = await Restaurants.create(updateData);
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

  static getDetailProRes = async ({ restaurant_id }) => {
    return await Restaurants.findOne({ where: { user_id: restaurant_id } })
  }
}

module.exports = RestaurantService;
