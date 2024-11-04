const express = require("express");
const app = express();
const db = require("./models/index.model");
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.json());
//connect db
db.sequelize.sync();
//routes
app.use("", require("./routes"));
// app.use("",require("./routes"));
app.get("/", (req, res) => {
  res.send("Welcome to Foody App Server!");
});

module.exports = app;
