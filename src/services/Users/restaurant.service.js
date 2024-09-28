const db = requrie("../../models/index.model.js");
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
    return await Restaurants.update({
      name: restaurant.name,
      image: restaurant.image,
      address: restaurant.address,
      status: restaurant.status,
      where: { id: restaurant_id },
    });
  };

  static deleteRestaurant = async ({ restaurant_id }) => {
    return await Restaurants.update({
      status: "unactive",
      where: { id: restaurant_id },
    });
  };
}
module.exports = RestaurantService;
