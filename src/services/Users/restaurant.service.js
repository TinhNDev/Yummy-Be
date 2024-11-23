const db = require("../../models/index.model.js");
const {
  findRestauranByKeyWord,
  getNearbyRestaurantDetails,
} = require("./repositories/restaurant.repo.js");
const Restaurants = db.Restaurant;
const RedisHelper = require("../../cache/redis");
const { Op } = require("sequelize");
class RestaurantService {
  static async initRedis() {
    const redis = new RedisHelper({ keyPrefix: "restaurant:" });
    await redis.connect();
    return redis;
  }
  static updateRestaurant = async ({ restaurant_id, restaurant }) => {
    if (
      !restaurant?.name ||
      !restaurant.image ||
      !restaurant.address ||
      !restaurant.opening_hours ||
      !restaurant.phone_number ||
      !restaurant.description
    ) {
      throw new Error("The restaurant object contains null or invalid fields");
    }

    const existingRestaurant = await Restaurants.findOne({
      where: { user_id: restaurant_id },
    });

    const updateData = {
      name: restaurant.name,
      image: restaurant.image,
      address: restaurant.address,
      user_id: restaurant_id,
      opening_hours: restaurant.opening_hours,
      phone_number: restaurant.phone_number,
      description: restaurant.description,
      address_x: restaurant.address_x,
      address_y: restaurant.address_y
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

  static getAllRestaurant = async (
    userLatitude,
    userLongitude,
    page = 1,
  ) => {
    const redisKey = `restaurants:nearby:${userLatitude}:${userLongitude}:${process.env.RADIUS}:page:${page}`;
    const redis = await RestaurantService.initRedis();
    
    const cachedData = await redis.get(redisKey);
    if (cachedData) {
      return cachedData;
    } else {
      const radiusInDegrees = process.env.RADIUS / 111.32;
      const limit = 20;
      const offset = (page - 1) * limit;
  
      const restaurants = await Restaurants.findAll({
        where: {
          address_x: {
            [Op.between]: [userLatitude - radiusInDegrees, userLatitude + radiusInDegrees],
          },
          address_y: {
            [Op.between]: [userLongitude - (process.env.RADIUS / (111.32 * Math.cos((userLatitude * Math.PI) / 180))),
                           userLongitude + (process.env.RADIUS / (111.32 * Math.cos((userLatitude * Math.PI) / 180)))],
          },
        },
      });
  

      const nearbyRestaurants = getNearbyRestaurantDetails(
        restaurants,
        userLatitude,
        userLongitude,
        process.env.RADIUS
      );
  
      nearbyRestaurants.sort((a, b) => a.distance - b.distance);
      const paginatedRestaurants = nearbyRestaurants.slice(offset, offset + limit);
  
      await redis.set(redisKey, JSON.stringify(paginatedRestaurants));
      return paginatedRestaurants;
    }
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
    return await Restaurants.findOne({ where: { user_id: restaurant_id } });
  };
  static getRestaurantById = async(id) =>{
    return await Restaurants.findByPk(id)
  }
  static lockProductByRes = async ({restaurant_id,product_id}) =>{
    return await db.Product.update({
      is_available: false,
    }, {where:{restaurant_id:restaurant_id}})
  }
}

module.exports = RestaurantService;
