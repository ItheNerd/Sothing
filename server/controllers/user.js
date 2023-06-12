const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../config/token");
const validateId = require("../utils/validateId");
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler(async (req, res) => {
  try {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      const user = await User.create(req.body);
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
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
    console.log("Cookies: ", req.cookies);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
      sameSite: "None",
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
  const refreshToken = req.cookies.refreshToken;
  validateId(_id);
  const user = await User.findById(_id);
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    return res
      .status(204)
      .json({ message: "User is not defined, check for expired tokens" });
  }
  user.refreshToken = "";
  user.accessToken = "";
  await user.save();
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  return res.status(204).json({ message: "Succesfully Logged Out" });
});

const handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const { _id } = req.user;
  validateId(_id);
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }
  try {
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (_id.toString() !== decodedToken.id) {
      console.log(_id.toString(), decodedToken.id);
      throw new Error("token ID is not the same as userID");
    }
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    user.accessToken = newAccessToken;
    user.refreshToken = newRefreshToken;
    await user.save();
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // 72 hours
    });
    res.json({ newAccessToken });
  } catch (err) {
    res.status(401).json({ message: err.message });
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
      userData = await User.find().select(
        "firstname lastname email mobile isBlocked role"
      );
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
