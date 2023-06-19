const { Address } = require("../models/User");

const createAddress = asyncHandler(async (req, res) => {
  const { country, state, city, locality, landmarks, pincode } = req.body;

  // Create a new address object
  const address = new Address({
    country,
    state,
    city,
    locality,
    landmarks,
    pincode,
  });

  // Check if the user is an admin
  if (req.user.role === "admin") {
    // If the user is an admin, assign the address to a specific user
    const { userId } = req.body;
    address.user = userId;
  } else {
    // If the user is not an admin, assign the address to the logged-in user
    address.user = req.user._id;
  }

  // Save the address
  await address.save();

  res.status(201).json({ address });
});

const getAllAddresses = asyncHandler(async (req, res) => {
  // Check if the user is an admin
  if (req.user.role === "admin") {
    // If the user is an admin, get all addresses
    const addresses = await Address.find().populate(
      "user",
      "firstname lastname"
    );
    res.json({ addresses });
  } else {
    // If the user is not an admin, get addresses of the logged-in user only
    const addresses = await Address.find({ user: req.user._id });
    res.json({ addresses });
  }
});

const getAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  // Check if the user is an admin
  if (req.user.role === "admin") {
    // If the user is an admin, get the address by ID
    const address = await Address.findById(addressId).populate(
      "user",
      "firstname lastname"
    );
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({ address });
  } else {
    // If the user is not an admin, get the address of the logged-in user
    const address = await Address.findOne({
      _id: addressId,
      user: req.user._id,
    });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({ address });
  }
});

const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const { country, state, city, locality, landmarks, pincode } = req.body;

  // Check if the user is an admin
  if (req.user.role === "admin") {
    // If the user is an admin, update the address without checking the user ID
    const address = await Address.findByIdAndUpdate(
      addressId,
      { country, state, city, locality, landmarks, pincode },
      { new: true }
    );
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({ address });
  } else {
    // If the user is not an admin, update the address of the logged-in user
    const address = await Address.findOneAndUpdate(
      { _id: addressId, user: req.user._id },
      { country, state, city, locality, landmarks, pincode },
      { new: true }
    );
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({ address });
  }
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  // Check if the user is an admin
  if (req.user.role === "admin") {
    // If the user is an admin, delete the address without checking the user ID
    const address = await Address.findByIdAndRemove(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({ message: "Address deleted successfully" });
  } else {
    // If the user is not an admin, delete the address of the logged-in user
    const address = await Address.findOneAndRemove({
      _id: addressId,
      user: req.user._id,
    });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({ message: "Address deleted successfully" });
  }
});

module.exports = {
  createAddress,
  getAllAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
};
