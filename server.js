const app = require("./src/app");
const fs = require("fs");
const http = require("http");
const https = require("https");
const privateKey = fs.readFileSync("./src/configs/SSL/localhost.key", "utf-8");
const certificate = fs.readFileSync("./src/configs/SSL/localhost.crt", "utf-8");
const credentials = { key: privateKey, cert: certificate };
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`Hello welcome to server with port : ${PORT}`);
});
