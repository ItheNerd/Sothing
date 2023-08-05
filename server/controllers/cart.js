const asyncHandler = require("express-async-handler");
const { Product } = require("../models/Product");
const Cart = require("../models/Cart");

// Helper function to populate product data for the specific variantConfigId
const populateCartItemWithProduct = async (cart) => {
  let populatedCart = await cart.populate(
    "items.productId",
    "title variantConfig coverImageURL company brand rating"
  );
  const cartObject = populatedCart.toObject();
  //   Loop through each item in the cart and filter the variantConfig to include only the relevant one
  for (const item of cartObject.items) {
    const variantConfigId = item.variantConfigId.toString();
    const product = item.productId;
    const variantConfig = product.variantConfig.find(
      (variant) => variant._id.toString() === variantConfigId
    );

    // Update the product data to only include the relevant variantConfig
    item.productId = {
      ...product,
      variantConfig: [variantConfig],
    };
  }

  // Calculate the total price and round it off to the nearest 1/100th place
  const totalPrice = cartObject.items.reduce((total, item) => {
    const productPrice = item.productId.variantConfig[0].price.amount;
    return total + productPrice * item.quantity;
  }, 0);

  cartObject.totalPrice = Number(totalPrice.toFixed(2)); // Round off to 2 decimal places

  return cartObject;
};

// Add a product to the cart
const addToCart = asyncHandler(async (req, res) => {
  try {
    const { productId, variantConfigId, quantity } = req.body;
    const { _id: userId } = req.user;
    // Check if the product exists and get its variant inventory
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const variantInventory = product.variantConfig.find(
      (variant) => variant._id.toString() === variantConfigId
    );

    if (!variantInventory) {
      return res
        .status(404)
        .json({ error: "Variant configuration not found." });
    }

    // Check if the requested quantity is available
    if (quantity > variantInventory.quantity) {
      return res
        .status(400)
        .json({ error: "Insufficient quantity available." });
    }

    // Find the user's cart or create a new cart if it doesn't exist
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If the cart doesn't exist, create a new one
      cart = new Cart({ userId });
    }

    // Check if the product is already in the cart
    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variantConfigId.toString() === variantConfigId
    );

    if (existingItem) {
      // If the product already exists in the cart, update the quantity
      existingItem.quantity += quantity;
    } else {
      // If the product doesn't exist in the cart, add it as a new item
      cart.items.push({ productId, variantConfigId, quantity });
    }

    // Save the cart
    await cart.save();
    const populatedCart = await populateCartItemWithProduct(cart);
    res.status(200).json(populatedCart);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "User already has a cart." });
    }
    res.status(500).json({ error: "Failed to add item to the cart." });
  }
});

// Get the cart for a specific user
const getCart = asyncHandler(async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    const populatedCart = await populateCartItemWithProduct(cart);
    console.log(populatedCart);
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart." });
  }
});

// Update a specific item in the cart
const updateCartItem = asyncHandler(async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.query;
    const { _id: userId } = req.user;

    // Find the cart for the given user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    // Find the specific cart item to be updated
    const cartItem = cart.items.find((item) => item._id.toString() === itemId);

    if (!cartItem) {
      return res.status(404).json({ error: "Item not found in the cart." });
    }

    // Find the product and variantConfig for the cart item
    const product = await Product.findById(cartItem.productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const variantInventory = product.variantConfig.find(
      (variant) =>
        variant._id.toString() === cartItem.variantConfigId.toString()
    );

    if (!variantInventory) {
      return res
        .status(404)
        .json({ error: "Variant configuration not found." });
    }

    // Check if the requested quantity is available
    if (quantity > variantInventory.quantity) {
      return res
        .status(400)
        .json({ error: "Insufficient quantity available." });
    }

    // Update the quantity for the specified item in the cart
    cartItem.quantity = quantity;
    await cart.save();

    // Populate cart items with product information
    const populatedCart = await populateCartItemWithProduct(cart);

    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart item." });
  }
});

// Remove a specific item from the cart
const removeCartItem = asyncHandler(async (req, res) => {
  try {
    const { itemId } = req.params;
    const { _id: userId } = req.user;
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ error: "Cart or item not found." });
    }

    await cart.save();
    const populatedCart = await populateCartItemWithProduct(cart);
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from cart." });
  }
});

// Clear the cart for a specific user
const clearCart = asyncHandler(async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    // Trigger the virtual getter for totalPrice
    await cart.save();
    const populatedCart = await populateCartItemWithProduct(cart);
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: "Failed to clear cart." });
  }
});

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
