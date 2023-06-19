const { Category, Subcategory } = require("../models/Product");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  try {
    const existingCategory = await Category.findOne({ title });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = await Category.create(req.body);
    console.log(category);

    res.status(201).json({ category: category });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
const createSubCategory = asyncHandler(async (req, res) => {
  const { title, category } = req.body;
  try {
    const existingCategory = await Category.findOne({ title: category });

    if (!existingCategory) {
      return res.status(400).json({ error: "Category not found" });
    }

    const existingSubCategory = await Subcategory.findOne({
      title,
      category: existingCategory._id,
    });

    if (existingSubCategory) {
      return res.status(400).json({ error: "Subcategory already exists" });
    }

    const subCategory = await Subcategory.create({
      title,
      category: existingCategory._id,
    });

    res.status(201).json({ subCategory });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  createCategory,
  createSubCategory,
};
