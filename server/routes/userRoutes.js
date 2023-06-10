const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserInfo,
  deleteUser,
  updateUser,
  blockUser,
} = require("../controllers/user");
const { authHandler, adminAuthHandler } = require("../middleware/authHandler");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", authHandler, logoutUser);
router.get("/", authHandler, getUserInfo);
router.delete("/", adminAuthHandler, deleteUser);
router.put("/", authHandler, updateUser);
router.put("/block", adminAuthHandler, blockUser);

module.exports = router;
