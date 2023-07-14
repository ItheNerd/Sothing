const { User } = require("../models/User");
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
        sameSite: "none",
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
    if (!user.isBlocked) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { refreshToken, accessToken },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
      });
      res.json({
        _id: updatedUser._id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      throw new Error("Account Blocked");
    }
  } else {
    throw new Error("Invalid Credentials");
  }
});

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
      .status(200)
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
  return res.status(200).json({ message: "Succesfully Logged Out" });
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
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (refreshToken !== user.refreshToken) {
      console.log("refrrrshToken:", refreshToken, user.refreshToken);
      throw new Error("tokens do not match");
    }
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    user.accessToken = newAccessToken;
    user.refreshToken = newRefreshToken;
    await user.save();
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // 72 hours,
      sameSite: "None",
      secure: true,
    });
    console.log("refreshToken:", refreshToken, user.refreshToken);
    res.json({ newAccessToken, newRefreshToken });
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
  const { country, state, city, locality, landmarks, pincode } =
    req.body.address;
  validateId(_id);
  try {
    let updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobile: req.body.mobile,
      },
      {
        new: true,
      }
    ).populate("address");

    // Check if the user has an address
    if (!updatedUser.address) {
      // Create a new address and associate it with the user
      const newAddress = await Address.create({
        user: _id,
        country,
        state,
        city,
        locality,
        landmarks,
        pincode,
      });

      // Associate the new address with the user
      updatedUser.address = newAddress._id;
    } else {
      // Check if the logged-in user matches the address owner
      if (updatedUser.address.user.toString() !== _id.toString()) {
        return res
          .status(403)
          .json({ error: "You are not authorized to update this address" });
      }
      // Update the address details
      updatedUser.address.country = country;
      updatedUser.address.state = state;
      updatedUser.address.city = city;
      updatedUser.address.locality = locality;
      updatedUser.address.landmarks = landmarks;
      updatedUser.address.pincode = pincode;

      // Save the updated address
      await updatedUser.address.save();
    }

    // Save the updated user
    updatedUser = await updatedUser.save();

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

const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      user.password = password;
      await user.save();
      if (email) {
        res.status(201).json({
          message: "password successfully reset for e-commerce",
          _id: user._id,
          firstname: user.firstname,
          email: user.email,
        });
      }
    } else {
      res.status(400).json({
        message: "password reset unsuccseful",
        _id: user._id,
        firstname: user.firstname,
        email: user.email,
      });
    }
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
  resetPassword,
};
