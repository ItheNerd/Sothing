const User = require("../models/User");

const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../config/token");

// Register a User
const registerUser = asyncHandler(async (req, res) => {
  try {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      const user = await User.create(req.body);
      //   Generating Tokens
      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);

      // Update the user document with the refresh and access tokens
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { refreshToken, accessToken },
        { new: true }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });

      res.status(201).json({
        message: "User registered successfully",
        _id: updatedUser._id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        token: accessToken,
      });
    } else {
      return res.status(409).json({ message: "User already exists" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Registration failed" });
  }
});

// Login a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const user = await User.findOne({ email });
  if (user && (await user.isPasswordMatched(password))) {
    // Generate access token and refresh token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Update the user document with the refresh and access tokens
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { refreshToken, accessToken },
      { new: true }
    );

    // Set the refresh token in the response cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    // Return the user data and access token in the response
    res.json({
      _id: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      token: accessToken,
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// logout functionality
const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

// Refresh access token controller
const handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  // Check if refresh token exists
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }
  try {
    // Verify the refresh token
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // 72 hours
    });
    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  handleRefreshToken,
};
