const { Product, Category, Brand, Subcategory } = require("../models/Product");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateId = require("../utils/validateId");
const Company = require("../models/Company");
const capitalize = require("../utils/capitalize");
const { default: mongoose } = require("mongoose");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    let brand = await Brand.findOne({ title: req.body.brand });
    if (!brand) {
      brand = await Brand.create({ title: req.body.brand });
    }
    const category = await Category.findOne({ title: req.body.category });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    if (req.body.subCategory) {
      const subCategory = await Category.findOne({
        title: req.body.subCategory,
      });
      if (!subCategory) {
        return res.status(404).json({ error: "Sub Category not found" });
      }
    }
    const company = await Company.findOne({ title: req.body.company });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    req.body.brand = brand._id;
    req.body.category = category._id;
    req.body.company = company._id;

    const existingProduct = await Product.findOne({
      category: req.body.category,
      company: req.body.company,
      brand: req.body.brand,
      slug: req.body.slug,
    });

    if (existingProduct) {
      return res.status(400).json({ error: "Product already exists" });
    }

    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { company } = req.user;
  validateId(id);
  try {
    const product = await Product.findByIdAndUpdate(id);
    if (product.company === company) {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const updateProduct = await Product.findOneAndUpdate({ id }, req.body, {
        new: true,
      });
      res.json(updateProduct);
    }
  } catch (error) {
    throw new Error("Product Aldready exists");
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const conversionFields = ["category", "brand", "subcategory"];
    for (const field of conversionFields) {
      if (queryObj[field]) {
        const model = capitalize(field); // Model names are in capital
        const document = await mongoose
          .model(model)
          .findOne({ title: queryObj[field] });
        if (document) {
          queryObj[field] = document._id;
        }
      }
    }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr))
      .populate("brand", "title")
      .populate("category", "title")
      .populate("company", "title");

    // Sorting
    if (req.query.sort) {
      const sortOption = req.query.sort;
      switch (sortOption) {
        case "price_asc":
          query = query.sort("price");
          break;
        case "price_desc":
          query = query.sort("-price");
          break;
        case "popularity":
          query = query.sort("-views -sold -ratings");
          break;
        case "rating":
          query = query.sort("-ratings.star");
          break;
        case "newest":
          query = query.sort("-createdAt");
          break;
        default:
          query = query.sort("-createdAt");
          break;
      }
    } else {
      query = query.sort("-createdAt");
    }

    // Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const productCount = await Product.countDocuments();
    if (req.query.page && skip >= productCount) {
      throw new Error("Page does not exist");
    }

    query = query.skip(skip).limit(limit);
    const products = await query;
    res.json({
      page,
      limit,
      totalProducts: productCount,
      totalPages: Math.ceil(productCount / limit),
      products,
    });
  } catch (error) {
    res.status(404).json({ error: "This page does not exist" });
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    validateId(id);
    const product = await Product.findById(id)
      .populate("brand", "title")
      .populate("category", "title")
      .populate("company", "title");

    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

const getRecommendedProduct = asyncHandler(async (req, res) => {
  try {
    // get the current product ID
    const { id } = req.query;
    const currentProduct = await Product.findById(id);

    const limit = parseInt(req.query.limit) || 5;

    const category = currentProduct.category; // it is actually the category id
    const tags = currentProduct.tags;

    // now we fetch 5 random products with the same category or tag
    const similarProducts = await Product.find({
      $or: [{ category: category }, { tags: { $in: tags } }],
      _id: { $ne: id },
    })
      .limit(limit) // Limit the number of recommended products to 5
      .select("price title images tags")
      .lean(); // Convert Mongoose documents to plain JavaScript objects

    res.json(similarProducts);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch recommended products" });
  }
});

const searchProduct = asyncHandler(async (req, res) => {
  try {
    const { search } = req.query;
    const product_data = await Product.find({
      title: { $regex: ".*" + search + ".*", $options: "i" },
    });
    if (product_data.length === 0) {
      return res.status(200).send({ message: "Products not found" });
    }
    return res
      .status(200)
      .send({ message: "Product details", data: product_data });
  } catch (error) {
    throw new Error(error);
  }
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalproduct);
  } catch (error) {
    throw new Error(error);
  }
});

const createBrand = asyncHandler(async (req, res) => {
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

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  getRecommendedProduct,
  searchProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  createBrand,
};
