const asyncHandler = require("express-async-handler");
const { Cart } = require("../models/User");
const { Product } = require("../models/Product");
// All controllers must be used with authHandler
// Helper function to find the cart for a user
const findUserCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate(
    "products.product",
    "title price"
  );
  return cart;
};

// Add a product to the cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, variants_id } = req.body;
  const { _id } = req.user;

  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }

  const product = await Product.findById(productId);
  console.log(product.coverImageURL);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const cartItem = {
    product: product._id,
    quantity: quantity || 1,
    variants_id: variants_id || [],
    image: product.coverImageURL,
  };

  let cart = await findUserCart(_id);

  if (!cart) {
    cart = await Cart.create({ user: _id });
  }

  const existingCartItem = cart.products.find((item) => {
    return (
      item.product?._id.toString() === productId && item.variants === variants
    );
  });

  if (existingCartItem) {
    // If the same product and variant exist in the cart, increment the quantity
    existingCartItem.quantity += quantity || 1;
  } else {
    // If the product is new or has a different variant, add it to the cart
    cart.products.push(cartItem);
  }

  // Update the total price of the cart
  cart.total += product.price * (quantity || 1);

  await cart.save();

  res.status(201).json({ message: "Product added to cart", cart });
});

// Get the cart for the logged-in user
const getCart = asyncHandler(async (req, res) => {
  const cart = await findUserCart(req.user._id);

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  res.json({ cart });
});

// Update quantity of a cart item
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }

  let cart = await findUserCart(req.user._id);

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const existingCartItemIndex = cart.products.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingCartItemIndex !== -1) {
    cart.products[existingCartItemIndex].quantity = quantity;
    await cart.save();

    return res.json({ message: "Cart item updated", cart });
  }

  res.status(404).json({ message: "Cart item not found" });
});

// Remove a cart item
const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }

  let cart = await findUserCart(req.user._id);

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const existingCartItemIndex = cart.products.findIndex(
    (item) => item.product._id.toString() === productId
  );

  if (existingCartItemIndex !== -1) {
    const removedCartItem = cart.products.splice(existingCartItemIndex, 1)[0];

    // Update the total price of the cart
    cart.total -= removedCartItem.product.price * removedCartItem.quantity;

    await cart.save();

    return res.json({ message: "Cart item removed", cart });
  }

  res.status(404).json({ message: "Cart item not found" });
});

// Clear the entire cart
const clearCart = asyncHandler(async (req, res) => {
  let cart = await findUserCart(req.user._id);

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.products = [];
  cart.total = 0;
  await cart.save();

  res.json({ message: "Cart cleared", cart });
});

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
