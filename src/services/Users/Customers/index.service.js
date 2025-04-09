const { getDistance } = require('geolib');
const {
  Customer,
  Profile,
  Order,
  Restaurant,
  Driver,
} = require('../../../models/index.model');
const { getRestaurantById } = require('../restaurant.service');
const calculateDistance = require('../../../helper/calculateDistance');
const db = require('../../../models/index.model');

class CustomerService {
  static getAllOrderForCustomer = async ({ user_id }) => {
    const profile = await Profile.findOne({ where: { user_id: user_id } });
    if (!profile) throw new Error('Profile not found');

    const customer = await Customer.findOne({
      where: { profile_id: profile.id },
    });
    if (!customer) throw new Error('Customer not found');

    return await Order.findAll({
      where: { customer_id: customer.id },
      include: [
        {
          model: Restaurant,
          as: 'Restaurant',
          attribute: [],
        },
        {
          model: Driver,
          attribute: [],
          as: 'Driver',
          include: [
            {
              model: Profile,
              as: 'Profile',
              attributes: ['name', 'image'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  };

  static getOrderForCustomer = async ({ user_id, order_id }) => {
    const Customer = await Customer.findOne({ where: { user_id: user_id } });
    return await Order.findOne({
      where: { customer_id: Customer.id, id: order_id },
    });
  };

  static getDistance = async ({
    restaurant_id,
    userLongtitude,
    userLatitude,
  }) => {
    const restaurant = await getRestaurantById(restaurant_id);
    const distance = getDistance(
      { latitude: userLatitude, longitude: userLongtitude },
      { latitude: restaurant.address_x, longitude: restaurant.address_y }
    );
    return distance / 1000;
  };

  static addToFavoriteRestaurant = async ({ user_id, restaurant_id }) => {
    let favorite = await db.FavoriteRestaurants.findOne({
      where: {
        user_id: user_id,
        restaurant_id: restaurant_id,
      },
    });

    if (favorite) {
      favorite = await favorite.update({
        is_favorite: !favorite.is_favorite,
      });
    } else {
      favorite = await db.FavoriteRestaurants.create({
        user_id: user_id,
        restaurant_id: restaurant_id,
        is_favorite: true,
      });
    }

    return favorite;
  };

  static getLisFavoriteRes = async ({ user_id }) => {
    return await db.FavoriteRestaurants.findAll({
      where: {
        user_id: user_id,
        is_favorite: true,
      },
    });
  };

  static checkFavorite = async ({ user_id, restaurant_id }) => {
    const favorite = await db.FavoriteRestaurants.findOne({ where: { user_id: user_id, restaurant_id: restaurant_id } })
    if (favorite && favorite.is_favorite) return true
    return false
  }
}

module.exports = CustomerService;
