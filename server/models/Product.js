const mongoose = require("mongoose");

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
  name: {
    type: String,
    required: true,
  },
  sq_id: {
    type: String,
    required: true,
    unique: true,
  },
  variantCombination: {
    type: [variantValueSchema],
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        // Count the occurrences of each variant type
        const typeCounts = {};
        for (const combination of value) {
          const variantType = combination.variantType;
          typeCounts[variantType] = (typeCounts[variantType] || 0) + 1;
        }

        // Check if there is at most one instance of each variant type
        for (const count of Object.values(typeCounts)) {
          if (count > 1) {
            return false; // Validation failed
          }
        }

        return true; // Validation passed
      },
      message: "Only one instance of each variant type is allowed.",
    },
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
  rating: {
    type: Number,
    default: 0,
  },
});

const variantTypeSchema = new mongoose.Schema({
  variantType: {
    type: String,
    required: true,
  },
  variantValues: {
    type: [String],
    required: true,
    default: [],
  },
});

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    variantConfig: {
      type: [variantInventorySchema],
      required: true,
      default: [],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    brand: {
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
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

variantInventorySchema.index({ sq_id: 1, name: 1 }, { unique: true });

// Pre-save function
productSchema.pre("save", async function (next) {
  try {
    // Check if variant combinations are unique
    const variantCombinations = this.variantConfig.map(
      (variant) => variant.variantCombination
    );
    const uniqueCombinations = new Set();
    for (const combination of variantCombinations) {
      const combinationString = JSON.stringify(combination);
      if (uniqueCombinations.has(combinationString)) {
        throw new Error("Variant combinations must be unique");
      }
      uniqueCombinations.add(combinationString);
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Function to generate variantTable for a product
const generateVariantTable = async function (productId) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const variantTable = product.variantConfig.reduce((acc, variantConfig) => {
      const variantCombination = variantConfig.variantCombination;
      variantCombination.forEach((variant) => {
        const existingVariantType = acc.find(
          (item) => item.variantType === variant.variantType
        );
        if (existingVariantType) {
          if (
            !existingVariantType.variantValues.includes(variant.variantValue)
          ) {
            existingVariantType.variantValues.push(variant.variantValue);
          }
        } else {
          acc.push({
            variantType: variant.variantType,
            variantValues: [variant.variantValue],
          });
        }
      });
      return acc;
    }, []);

    await Product.findByIdAndUpdate(productId, { variantTable });
  } catch (error) {
    throw new Error(error);
  }
};

// Generate variantTable using post-save hook
productSchema.post("save", async function () {
  try {
    await generateVariantTable(this._id);
  } catch (error) {
    throw new Error(error);
  }
});

productSchema.index(
  { category: 1, company: 1, brand: 1, slug: 1 },
  { unique: true }
);

const Product = mongoose.model("Product", productSchema);
const VariantInventory = mongoose.model("VariantInventory", variantInventorySchema);
const Brand = mongoose.model("Brand", brandSchema);
const Category = mongoose.model("Category", categorySchema);

module.exports = {
  Product,
  Brand,
  Category,
  variantValueSchema,
  VariantInventory,
  variantTypeSchema,
};
