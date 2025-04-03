require("dotenv").config();
const app = require("./src/app");
const server = app.listen(8080);
process.on("SIGINT", () => {
    server.close(() => console.log(`Exit server Express`));
});
