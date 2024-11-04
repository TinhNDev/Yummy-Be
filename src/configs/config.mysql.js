<<<<<<< HEAD
require("dotenv").config();
module.exports = {
  HOST: process.env.HOST,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  DB: process.env.DB,
  dialect: process.env.DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: process.env.ACQUIRE,
    idle: process.env.IDLE,
  },
};
=======
require("dotenv").config();
module.exports = {
  HOST: process.env.HOST,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  DB: process.env.DB,
  dialect: process.env.DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: process.env.ACQUIRE,
    idle: process.env.IDLE,
  },
};
>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
