const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  // Define the payload for the access token
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  // Generate the access token using JWT
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  return accessToken;
}

function generateRefreshToken(user) {
  // Define the payload for the refresh token
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  // Generate the refresh token using JWT
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return refreshToken;
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
