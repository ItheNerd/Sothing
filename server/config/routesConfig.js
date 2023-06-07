const { registerUser } = require("../controllers/user");
const errorHandler = require("../middleware/errorHandler");
const userRoute = require("../routes/user")

function configureRoutes(app) {
  app.use('/api/user', userRoute);
  app.use('/user', registerUser);
  app.use(errorHandler);
}

module.exports = configureRoutes;