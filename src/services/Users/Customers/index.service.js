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

  static getOrderForCustomer = async ({ order_id }) => {
    const query = `
      SELECT 
        o.id,
        o.price,
        o.order_status,
        o.listCartItem,
        o.reciver_name,
        o.createdAt,
        o.updatedAt,
        o.phone_number,
        o.order_date,
        o.delivery_fee,
        o.order_pay,
        o.note,
        r.id,
        r.name,
        r.address,
        r.image,
        d.id AS driver_id,
        d.cic,
        d.license_plate,
        d.cccdBack,
        d.dob,
        d.car_name,
        d.cavet,
        p.name AS driver_name,
        p.image AS driver_image,
        p.phone_number AS driver_phone
      FROM Orders o
      JOIN Restaurants r ON r.id = o.restaurant_id
      JOIN Customers c ON c.id = o.customer_id
      LEFT JOIN Drivers d ON d.id = o.driver_id
      JOIN Users u ON u.id = c.user_id
      JOIN Profile p ON p.id = d.driver_id
      WHERE o.id = :order_id
    `;

    const results = await db.sequelize.query(query, {
      replacements: { order_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    return results[0];
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
    const favorite = await db.FavoriteRestaurants.findAll({
      where: {
        user_id: user_id,
        is_favorite: true,
      },
    });

    const restaurantIds = favorite.map(fav => fav.restaurant_id);

    const restaurantDetails = await db.Restaurant.findAll({
      where: {
        id: {
          [db.Sequelize.Op.in]: restaurantIds,
        },
      },
      attributes: ['id', 'name', 'image', 'description'],
    });

    return restaurantDetails;
  };


  static checkFavorite = async ({ user_id, restaurant_id }) => {
    const favorite = await db.FavoriteRestaurants.findOne({ where: { user_id: user_id, restaurant_id: restaurant_id } })
    if (favorite && favorite.is_favorite) return true
    return false
  }

  static getListProductFlashSale = async () => {
    const query = `
      SELECT 
        p.id AS product_id,
        p.name AS product_name
        p.image AS product_image,
        p.descriptions AS product_description,
        p.price AS original_price,
        fl.amount AS flash_sale_price,
        c.current_uses AS current_uses,
        c.max_uses_per_user AS max_uses_per_user
      FROM Products p
      JOIN flash_sales fl ON fl.product_id = p.id
      JOIN coupons c ON c.id = fl.coupon_id
      JOIN Restaurant r ON r.id = p.restaurant_id
    `;

    const results = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
    });

    return results;
  };
}

module.exports = CustomerService;
