const express = require("express");
const router = express.Router();

router.use("/v1/api", require("./Users/access"));
module.exports = router;
