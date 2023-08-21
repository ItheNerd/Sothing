const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOrigin");
const configureRoutes = require("./config/routesConfig");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const rebuildIndexes = require("./config/reBuildIndex");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

require("dotenv").config();

mongoose.Promise = global.Promise;

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

app.use((req, _, next) => {
  const trustedIPs = ["35.160.120.126", "44.233.151.27", "34.211.200.85", "18.139.194.139:443"];
  if (trustedIPs.includes(req.ip)) {
    app.set("trust proxy", true);
  }
  next();
});

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'"],
    },
  })
);
app.use(compression());
app.use(limiter);
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
