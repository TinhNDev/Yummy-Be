const db = require('../../models/index.model.js');
const {
  findRestauranByKeyWord,
  getNearbyRestaurantDetails,
} = require('./repositories/restaurant.repo.js');
const Restaurants = db.Restaurant;
const RedisHelper = require('../../cache/redis');
const { Op } = require('sequelize');
const haversineQuery = `
  6371 * 2 * ASIN(
    SQRT(
      POWER(SIN((? - address_x) * pi()/180 / 2), 2) + 
      COS(? * pi()/180) * COS(address_x * pi()/180) * 
      POWER(SIN((? - address_y) * pi()/180 / 2), 2)
    )
  ) AS distance
`;
class RestaurantService {
  static async initRedis() {
    const redis = new RedisHelper({ keyPrefix: 'restaurant:' });
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
      throw new Error('The restaurant object contains null or invalid fields');
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
      address_y: restaurant.address_y,
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
      status: 'active',
      where: { id: restaurant_id },
    });
  };

  static getRestaurantPending = async () => {
    return await Restaurants.findAll({
      where: { status: 'pending' },
    });
  };


  static getAllRestaurant = async (userLatitude, userLongitude, page = 1) => {
    const limit = 20;
    const offset = (page - 1) * limit;

    const RADIUS_KM = Number(process.env.RADIUS) / 1000;

    const query = `
    SELECT r.*, (
      6371 * acos(
        cos(radians(:userLat)) * cos(radians(r.address_x)) *
        cos(radians(r.address_y) - radians(:userLon)) +
        sin(radians(:userLat)) * sin(radians(r.address_x))
      )
    ) AS distance
    FROM Restaurants r
    HAVING distance <= :radius
    ORDER BY distance ASC
    LIMIT :limit OFFSET :offset
  `;

    const [results] = await db.sequelize.query(query, {
      replacements: {
        userLat: userLatitude,
        userLon: userLongitude,
        radius: RADIUS_KM,
        limit,
        offset
      },
      type: sequelize.QueryTypes.SELECT,
    });

    return results;
  };



  static searchRestaurantByKeyWord = async (keySearch) => {
    return await findRestauranByKeyWord(keySearch);
  };

  static deleteRestaurant = async ({ restaurant_id }) => {
    return await Restaurants.update({
      status: 'unactive',
      where: { id: restaurant_id },
    });
  };

  static getDetailProRes = async ({ restaurant_id }) => {
    return await Restaurants.findOne({ where: { user_id: restaurant_id } });
  };
  static getRestaurantById = async (id) => {
    return await Restaurants.findByPk(id);
  };
  static lockProductByRes = async ({ restaurant_id, product_id }) => {
    return await db.Product.update(
      {
        is_available: false,
      },
      { where: { restaurant_id: restaurant_id } }
    );
  };
  static getDetailProResForUser = async ({ restaurant_id }) => {
    return await Restaurants.findOne({ where: { id: restaurant_id } });
  };
}

module.exports = RestaurantService;
