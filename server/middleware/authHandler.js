const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const authHandler = asyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    let accessToken = req.headers.authorization.split(" ")[1];
    try {
      if (accessToken) {
        const decoded = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        const user = await User.findById(decoded?.id);
        // console.log("decoded:", decoded, " User:", user);
        if (
          accessToken === user.accessToken &&
          user.accessToken !== null &&
          user._id.toString() === decoded.id
        ) {
          req.user = user;
          console.log(
            "User role:",
            req.user.role,
            " User email:",
            req.user.email
          );
          next();
        } else {
          throw new Error("Authorization denied, Expired Token");
        }
      }
    } catch (error) {
      throw Error(error.message);
    }
  } else {
    throw new Error("Authorization denied, No token found");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  if (req?.user) {
    if (req?.user?.role !== "admin") {
      throw new Error("Not an Admin, Authorization denied");
    } else {
      next();
    }
  } else {
    throw new Error("User is not defined, check for expired tokens");
  }
});

const adminAuthHandler = asyncHandler(async (req, res, next) => {
  authHandler(req, res, async () => {
    isAdmin(req, res, next);
  });
});
module.exports = { authHandler, adminAuthHandler };
