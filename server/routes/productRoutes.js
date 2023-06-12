const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  getProduct,
  createCategory,
} = require("../controllers/product");
const { authHandler, adminAuthHandler } = require("../middleware/authHandler");
const router = express.Router();

router.post("/", authHandler, createProduct);

router.put("/wishlist", authHandler, addToWishlist);
router.put("/rating", authHandler, rating);
router.get("/", getProduct);
router.put("/:id", adminAuthHandler, updateProduct);
router.delete("/:id", adminAuthHandler, deleteProduct);
router.post("/category", adminAuthHandler, createCategory);

module.exports = router;