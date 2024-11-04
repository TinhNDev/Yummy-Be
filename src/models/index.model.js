const config = require("../configs/config.mysql");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  logging: false,
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

db.User = require("./Users/user.model")(sequelize, Sequelize);
db.Roles = require("./Users/roles.model")(sequelize, Sequelize);
db.KeyToken = require("./Users/keyToken.model")(sequelize, Sequelize);
db.ApiKey = require("./Users/apiKey.model")(sequelize, Sequelize);
db.Profile = require("./Users/profile.model")(sequelize, Sequelize);
db.Customer = require("./Users/Customers/customer.model")(sequelize, Sequelize);
db.Driver = require("./Users/Drivers/driver.model")(sequelize, Sequelize);
db.Address = require("./Users/address.model")(sequelize, Sequelize);
db.Order = require("./Users/order.model")(sequelize, Sequelize);
db.Notification = require("./Users/notification.model")(sequelize, Sequelize);
db.Categories = require("./Users/categories.model")(sequelize, Sequelize);
db.BlackList = require("./Users/blacklitst.model")(sequelize, Sequelize);
db.Cupon = require("./Users/cupon.model")(sequelize, Sequelize);
db.Product = require("./Users/products.model")(sequelize, Sequelize);
db.Restaurant = require("./Users/restaurants.model")(sequelize, Sequelize);
db.Topping = require("./Users/topping.model")(sequelize,Sequelize);
db.OrderItem = require("./Users/orderItem.model")(sequelize,Sequelize);
//user profile
db.User.hasOne(db.Profile, {
  foreignKey: "user_id",
  as: "Profile",
});
db.Profile.belongsTo(db.User, {
  foreignKey: "user_id",
  as: "User",
});

//customer profile
db.Profile.hasOne(db.Customer, {
  foreignKey: "profile_id",
  as: "Customer",
});
db.Customer.belongsTo(db.Profile, {
  foreignKey: "profile_id",
  as: "Profile",
});

//driver profile
db.Profile.hasOne(db.Driver, {
  foreignKey: "profile_id",
  as: "Driver",
});
db.Driver.belongsTo(db.Profile, {
  foreignKey: "profile_id",
  as: "Profile",
});

//profile address
db.Profile.belongsToMany(db.Address, {
  through: "Address Profile",
});
db.Address.belongsToMany(db.Profile, {
  through: "Address Profile",
});

//Product Restaurant
db.Restaurant.hasMany(db.Product, {
  foreignKey: "restaurant_id",
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
db.Product.belongsTo(db.Restaurant, {
  foreignKey: "restaurant_id",
});

//Categories Product
db.Categories.belongsToMany(db.Product, {
  through: "Product Categories",
});
db.Product.belongsToMany(db.Categories, {
  through: "Product Categories",
});



//Oder OderItem
db.Order.hasOne(db.OrderItem, {
  foreignKey: "order_id",
  as: "OrderItem",
});
db.OrderItem.belongsTo(db.Order, {
  foreignKey: "order_id",
  as: "Order",
});
//Product Order
db.Product.hasOne(db.OrderItem, {
  foreignKey: "prod_id",
  as: "OrderItem",
});
db.OrderItem.belongsTo(db.Product, {
  foreignKey: "prod_id",
  as: "Product",
});


// Cupon Product
db.Product.belongsToMany(db.Cupon, {
  through: "Cupon Product",
});
db.Cupon.belongsToMany(db.Product, {
  through: "Cupon Product",
});

//Cupon Order
db.Cupon.hasMany(db.Order, {
  foreignKey: "cupon_id",
});
db.Order.belongsTo(db.Cupon, {
  foreignKey: "cupon_id",
});

//customer order
db.Customer.hasMany(db.Order, {
  foreignKey: "customer_id",
});
db.Order.belongsTo(db.Customer, {
  foreignKey: "customer_id",
});

//user roles
db.User.belongsToMany(db.Roles, {
  through: "user_roles",
});
db.Roles.belongsToMany(db.User, {
  through: "user_roles",
});
//keyToken user
db.KeyToken.belongsTo(db.User, {
  foreignKey: "user_id",
});
db.User.hasMany(db.KeyToken, {
  foreignKey: "user_id",
});
//topping product
db.Product.belongsToMany(db.Topping,{
  through:"Product Topping"
})
db.Topping.belongsToMany(db.Product,{
  through:"Product Topping"
})
module.exports = db;
//user restaurant
db.User.hasOne(db.Restaurant,{
  foreignKey:"user_id",
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})
db.Restaurant.belongsTo(db.User,{
  foreignKey:"user_id"
})