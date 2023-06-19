const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cart");
const { authHandler } = require("../middleware/authHandler");

router.post("/", authHandler, addToCart);
router.get("/", authHandler, getCart);
router.put("/:productId", authHandler, updateCartItem);
router.delete("/:productId", authHandler, removeCartItem);
router.delete("/", authHandler, clearCart); // Clear the entire cart

module.exports = router;
