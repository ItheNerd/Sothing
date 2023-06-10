const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../config/token");
const validateId = require("../utils/validateId");

const registerUser = asyncHandler(async (req, res) => {
  try {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      const user = await User.create(req.body);
      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { refreshToken, accessToken },
        { new: true }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 72 * 60 * 60 * 1000,
      });

      res.status(201).json({
        message: "User registered successfully",
        _id: updatedUser._id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        accessToken: accessToken,
      });
    } else {
      return res.status(409).json({ message: "User already exists" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Registration failed" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.isPasswordMatched(password))) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { refreshToken, accessToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      maxAge: new Date(Date.now() + 25892000000),
      httpOnly: true,
    });
    res.json({
      _id: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      accessToken: accessToken,
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// needs to be  used with authHandler for user details
const logoutUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateId(_id);
  const user = await User.findById(_id);
  if (!user) {
    throw new Error("User is not defined, check for expired tokens");
  }
  user.refreshToken = "";
  user.accessToken = "";
  await user.save();
  res.json({ message: "Succesfully Logged Out" });
});

const handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }
  try {
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

const getUserInfo = asyncHandler(async (req, res) => {
  const { id } = req.query;
  try {
    let userData;
    if (id) {
      validateId(id);
      userData = await User.findById(id).select(
        "firstname lastname email mobile"
      );
    } else {
      userData = await User.find().select("firstname lastname email mobile isBlocked role");
    }
    if (userData) {
      return res.json({
        data: userData,
      });
    } else {
      return res.json({
        data: userData,
        message: "No user found",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.query;
  validateId(id);
  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    if (!deleteaUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id, block } = req.query;
  const validStatusList = ["true", "false"];
  try {
    validateId(id);
    if (!validStatusList.includes(block)) {
      throw new Error("Invalid Blocked Status");
    }
    const blockedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: block,
        refreshToken: "",
        accessToken: "",
      },
      {
        new: true,
      }
    );
    res.json({ data: blockedUser, message: `User status is set to ${block}` });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  handleRefreshToken,
  getUserInfo,
  deleteUser,
  updateUser,
  blockUser,
};
