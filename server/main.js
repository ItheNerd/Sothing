const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOrigin");
const configureRoutes = require("./config/routesConfig");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const rebuildIndexes = require("./config/reBuildIndex");

require("dotenv").config();

mongoose.Promise = global.Promise;

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(`${process.env.DB_URI}/sothings`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to MongoDB`);
    // Call the index rebuilding function
    rebuildIndexes();
    configureRoutes(app);
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
