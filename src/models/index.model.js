const config = require('../configs/config.mysql');

const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./Users/user.model')(sequelize, Sequelize);
db.Roles = require('./Users/roles.model')(sequelize, Sequelize);
db.KeyToken = require('./Users/keyToken.model')(sequelize, Sequelize);
db.ApiKey = require('./Users/apiKey.model')(sequelize, Sequelize);
db.Profile = require('./Users/profile.model')(sequelize, Sequelize);
db.Customer = require('./Users/Customers/customer.model')(sequelize, Sequelize);
db.Driver = require('./Users/Drivers/driver.model')(sequelize, Sequelize);
db.Address = require('./Users/address.model')(sequelize, Sequelize);
db.Order = require('./Users/order.model')(sequelize, Sequelize);
db.Notification = require('./Users/notification.model')(sequelize, Sequelize);
db.Categories = require('./Users/categories.model')(sequelize, Sequelize);
db.BlackList = require('./Users/blacklitst.model')(sequelize, Sequelize);
db.Coupon = require('./Users/coupon.model')(sequelize, Sequelize);
db.Product = require('./Users/products.model')(sequelize, Sequelize);
db.Restaurant = require('./Users/restaurants.model')(sequelize, Sequelize);
db.Topping = require('./Users/topping.model')(sequelize, Sequelize);
db.OrderItem = require('./Users/orderItem.model')(sequelize, Sequelize);
db.Payment = require('../models/Users/Customers/payment.model')(
  sequelize,
  Sequelize
);
db.Review = require('../models/Users/reviews.model')(sequelize, Sequelize);
db.Message = require('../models/Users/message.model')(sequelize, Sequelize);
db.FavoriteRestaurants = require('../models/Users/favoriteRestaurant.model')(
  sequelize,
  Sequelize
);
db.CouponUsage = require('./Users/couponUsage.model')(sequelize, Sequelize);
//user profile
db.User.hasOne(db.Profile, {
  foreignKey: 'user_id',
  as: 'Profile',
});
db.Profile.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'User',
});

//customer profile
db.Profile.hasOne(db.Customer, {
  foreignKey: 'profile_id',
  as: 'Customer',
});
db.Customer.belongsTo(db.Profile, {
  foreignKey: 'profile_id',
  as: 'Profile',
});

//driver profile
db.Profile.hasOne(db.Driver, {
  foreignKey: 'profile_id',
  as: 'Driver',
});
db.Driver.belongsTo(db.Profile, {
  foreignKey: 'profile_id',
  as: 'Profile',
});

// In Profile model
db.Profile.hasMany(db.Address, {
  as: 'Address',
  foreignKey: 'profileId',
});

// In Address model
db.Address.belongsTo(db.Profile, {
  as: 'Profile',
  foreignKey: 'profileId',
});

//Product Restaurant
db.Restaurant.hasMany(db.Product, {
  foreignKey: 'restaurant_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
db.Product.belongsTo(db.Restaurant, {
  foreignKey: 'restaurant_id',
});

//Categories Product
db.Categories.belongsToMany(db.Product, {
  through: 'Product Categories',
});
db.Product.belongsToMany(db.Categories, {
  through: 'Product Categories',
});

// //Oder OderItem
// db.Order.hasOne(db.OrderItem, {
//   foreignKey: "order_id",
//   as: "OrderItem",
// });
// db.OrderItem.belongsTo(db.Order, {
//   foreignKey: "order_id",
//   as: "Order",
// });
//Product Order
db.Product.hasOne(db.OrderItem, {
  foreignKey: 'prod_id',
  as: 'OrderItem',
});
db.OrderItem.belongsTo(db.Product, {
  foreignKey: 'prod_id',
  as: 'Product',
});
//Restaurant Order
db.Restaurant.hasMany(db.Order, {
  foreignKey: 'restaurant_id',
});
db.Order.belongsTo(db.Restaurant, {
  foreignKey: 'restaurant_id',
});
//Restaurant Order
db.Order.hasMany(db.BlackList, {
  foreignKey: 'order_id',
});
db.BlackList.belongsTo(db.Order, {
  foreignKey: 'order_id',
});

db.Driver.hasMany(db.BlackList, {
  foreignKey: 'driver_id',
});
db.BlackList.belongsTo(db.Driver, {
  foreignKey: 'driver_id',
});

//Restaurant Order
db.Driver.hasMany(db.Order, {
  foreignKey: 'driver_id',
});
db.Order.belongsTo(db.Driver, {
  foreignKey: 'driver_id',
});

//customer order
db.Customer.hasMany(db.Order, {
  foreignKey: 'customer_id',
});
db.Order.belongsTo(db.Customer, {
  foreignKey: 'customer_id',
});

//user roles
db.User.belongsToMany(db.Roles, {
  through: 'user_roles',
  as: 'roles', // Thêm alias này
});
db.Roles.belongsToMany(db.User, {
  through: 'user_roles',
  as: 'users', // Thêm alias này
});
//keyToken user
db.KeyToken.belongsTo(db.User, {
  foreignKey: 'user_id',
});
db.User.hasMany(db.KeyToken, {
  foreignKey: 'user_id',
});
//topping product
db.Product.belongsToMany(db.Topping, {
  through: 'Product Topping',
});
db.Topping.belongsToMany(db.Product, {
  through: 'Product Topping',
});
module.exports = db;
//user restaurant
db.User.hasOne(db.Restaurant, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
db.Restaurant.belongsTo(db.User, {
  foreignKey: 'user_id',
});

//Order payment
db.Order.hasMany(db.Payment, {
  foreignKey: 'order_id',
});
db.Payment.belongsTo(db.Order, {
  foreignKey: 'order_id',
});

db.Review.belongsTo(db.Customer, {
  foreignKey: 'customer_id',
});
db.Customer.hasMany(db.Review, {
  foreignKey: 'customer_id',
});

db.Review.belongsTo(db.Restaurant, {
  foreignKey: 'restaurant_id',
});
db.Restaurant.hasMany(db.Review, {
  foreignKey: 'restaurant_id',
});

db.Review.belongsTo(db.Driver, {
  foreignKey: 'driver_id',
});
db.Driver.hasMany(db.Review, {
  foreignKey: 'driver_id',
});

db.User.hasMany(db.Message, {
  foreignKey: 'user_id',
  as: 'Messages',
});
db.Message.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'User',
});

// Mối quan hệ giữa Coupon và CouponUsage
db.Coupon.hasMany(db.CouponUsage, {
  foreignKey: 'coupon_id',
  as: 'couponUsages',
});
db.CouponUsage.belongsTo(db.Coupon, {
  foreignKey: 'coupon_id',
  as: 'Coupon',
});

// Mối quan hệ giữa User và CouponUsage
db.User.hasMany(db.CouponUsage, {
  foreignKey: 'user_id',
  as: 'couponUsages',
});
db.CouponUsage.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'User',
});

// Mối quan hệ giữa Order và CouponUsage
db.Order.hasMany(db.CouponUsage, {
  foreignKey: 'order_id',
  as: 'couponUsages',
});
db.CouponUsage.belongsTo(db.Order, {
  foreignKey: 'order_id',
  as: 'Order',
});
