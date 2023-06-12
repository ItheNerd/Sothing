const mongoose = require("mongoose");

var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    variants: [
      {
        variantType: String,
        variantConfigurations: [],
      },
    ],
    tags: String,
    ratings: [
      {
        star: Number,
        review: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", productSchema);

const categorySchema = new mongoose.Schema(
  {
    title: {
      index: true,
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);
const Category = mongoose.model("Category", categorySchema);

module.exports = { Product, Category };
