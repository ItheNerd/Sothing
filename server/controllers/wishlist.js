// Create wishlist
const createWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { products } = req.body;

  const wishlist = await Wishlist.create({ user: _id, products });

  res.status(201).json({ wishlist });
});

// Get user's wishlist
const getUserWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const wishlist = await Wishlist.findOne({ user: _id }).populate("products");

  if (!wishlist) {
    return res.status(404).json({ message: "Wishlist not found" });
  }

  res.json({ wishlist });
});

// Add product to wishlist
const addProductToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId } = req.params;

  let wishlist = await Wishlist.findOne({ user: _id });

  if (!wishlist) {
    // Create a new wishlist for the user
    wishlist = await Wishlist.create({ user: _id });
  }

  // Add the product to the wishlist
  wishlist.products.push(productId);
  await wishlist.save();

  res.json({ wishlist });
});

// Remove product from wishlist
const removeProductFromWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { wishlistId, productId } = req.params;

  const wishlist = await Wishlist.findOne({ _id: wishlistId, user: _id });

  if (!wishlist) {
    return res.status(404).json({ message: "Wishlist not found" });
  }

  wishlist.products = wishlist.products.filter(
    (p) => p.toString() !== productId
  );
  await wishlist.save();

  res.json({ wishlist });
});
