const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  getProduct,
  getRecommendedProduct,
  searchProduct,
  getAllProducts,
} = require("../controllers/product");
const {
  createCategory,
  createSubCategory,
} = require("../controllers/category");
const { authHandler, adminAuthHandler } = require("../middleware/authHandler");
const router = express.Router();

router.post("/", authHandler, createProduct);
router.get("/listings", getAllProducts);
router.get("/listings/:id", getProduct);
router.get("/recommendations", getRecommendedProduct);
router.get("/search", searchProduct);
router.put("/wishlist", authHandler, addToWishlist);
router.put("/rating", authHandler, rating);
router.put("/:id", adminAuthHandler, updateProduct);
router.delete("/:id", adminAuthHandler, deleteProduct);
router.post("/category", adminAuthHandler, createCategory);
router.post("/subcategory", adminAuthHandler, createSubCategory);

module.exports = router;
