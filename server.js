const app = require("./src/app");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`wellcome to foody:${PORT}`);
});
