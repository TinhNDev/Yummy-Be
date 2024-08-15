const config = require("../configs/config.mysql");

const Sequelize = require("sequelize");

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

db.User = require("./Users/user.model")(sequelize, Sequelize);
db.Roles = require("./Users/roles.model")(sequelize, Sequelize);
db.KeyToken = require("./Users/keyToken.model")(sequelize, Sequelize);

//user roles
db.User.belongsToMany(db.Roles, {
  through: "user_roles",
});
db.Roles.belongsToMany(db.User, {
  through: "user_roles",
});
//keyToken user
db.KeyToken.belongsTo(db.User, {
  foreignKey: "userId",
});
db.User.hasMany(db.KeyToken, {
  foreignKey: "userId",
});

module.exports = db;
