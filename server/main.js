const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOrigin");
const configureRoutes = require("./config/routesConfig");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

require("dotenv").config();

mongoose.Promise = global.Promise;

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(`${process.env.DB_URI}/sothingsDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to MongoDB`);
    configureRoutes(app);
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
