const fs = require("fs");
const path = require("path");
const errorHandler = require("../middleware/errorHandler");

function configureRoutes(app) {
  const routesPath = path.join(__dirname, "../routes");
  fs.readdirSync(routesPath).forEach((file) => {
    if (file.endsWith(".js")) {
      const route = require(path.join(routesPath, file));
      const basePath = `/api/${file.split("Routes.js")[0].toLowerCase()}`;
      app.use(basePath, route);
    }
  });
  app.use(errorHandler);
}

module.exports = configureRoutes;
