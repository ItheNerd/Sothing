const mongoose = require("mongoose");
const slugify = require("slugify");

const brandSchema = new mongoose.Schema(
  {
    title: {
      index: true,
      type: String,
      required: true,
      unique: true,
    },
    details: [String],
  },
  { timestamps: true }
);

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

const variantValueSchema = new mongoose.Schema({
  variantType: {
    type: String,
    required: true,
  },
  variantValue: {
    type: String,
    required: true,
  },
});

const variantInventorySchema = new mongoose.Schema({
  variantCombination: {
    type: [variantValueSchema],
    required: true,
    unique: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
      default: "INR",
    },
  },
  images: {
    type: [String],
    required: true,
    default: [],
  },
});

const variantTypeSchema = new mongoose.Schema({
  variantType: {
    type: String,
    required: true,
    unique: true,
  },
  variantValues: {
    type: [String],
    required: true,
    default: [],
  },
});

const productSchema = new mongoose.Schema({
  mainTitle: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  variantConfig: {
    type: [variantInventorySchema],
    required: true,
    default: [],
  },
  companySellingThisProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  brandOfProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  coverImageURL: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
    default: [],
  },
  variantTable: {
    type: [variantTypeSchema],
    required: true,
    default: [],
  },
});

// Pre-save function
productSchema.pre("save", async function (next) {
  this.slug = slugify(this.mainTitle, { lower: true });

  try {
    // Convert brand to its ID equivalent or create a new brand document
    const Brand = mongoose.model("Brand");
    const brand = await Brand.findOne({ title: this.brandOfProduct });
    if (brand) {
      this.brandOfProduct = brand._id;
    } else {
      const newBrand = new Brand({ title: this.brandOfProduct });
      await newBrand.save();
      this.brandOfProduct = newBrand._id;
    }

    // Convert category to its ID equivalent or send an error if it doesn't exist
    const Category = mongoose.model("Category");
    const category = await Category.findOne({ title: this.category });
    if (category) {
      this.category = category._id;
    } else {
      throw new Error(`Category '${this.category}' does not exist.`);
    }

    // Convert company to its ID equivalent or send an error if it doesn't exist
    const Company = mongoose.model("Company");
    const company = await Company.findOne({
      title: this.companySellingThisProduct,
    });
    if (company) {
      this.companySellingThisProduct = company._id;
    } else {
      throw new Error(
        `Company '${this.companySellingThisProduct}' does not exist.`
      );
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Generate variantTable using aggregation
productSchema.pre("save", async function (next) {
  try {
    const aggregationPipeline = [
      { $unwind: "$variantConfig" },
      { $unwind: "$variantConfig.variantCombination" },
      {
        $group: {
          _id: "$variantConfig.variantCombination.variantType",
          variantValues: {
            $addToSet: "$variantConfig.variantCombination.variantValue",
          },
        },
      },
      {
        $project: {
          variantType: "$_id",
          variantValues: 1,
          _id: 0,
        },
      },
    ];

    const variantTable = await this.model("Product").aggregate(
      aggregationPipeline
    );

    this.variantTable = variantTable;

    next();
  } catch (error) {
    next(error);
  }
});

productSchema.index(
  { category: 1, company: 1, brand: 1, slug: 1 },
  { unique: true }
);

const Product = mongoose.model("Product", productSchema);
const Brand = mongoose.model("Brand", brandSchema);
const Category = mongoose.model("Category", categorySchema);

module.exports = {
  Product,
  Brand,
  Category,
  variantValueSchema,
  variantInventorySchema,
  variantTypeSchema,
};
