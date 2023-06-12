const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  getProduct,
} = require("../controllers/product");
const { authHandler, adminAuthHandler } = require("../middleware/authHandler");
const router = express.Router();

router.post("/", createProduct);

router.put("/wishlist", authHandler, addToWishlist);
router.put("/rating", authHandler, rating);
router.get("/", getProduct);
router.put("/", adminAuthHandler, updateProduct);
router.delete("/", adminAuthHandler, deleteProduct);

module.exports = router;