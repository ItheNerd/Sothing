const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// const wishlistSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   products: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//     },
//   ]
// });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      variants: [
        {
          variantType: String,
          variantConfigurations: [String],
          id: mongoose.Schema.Types.ObjectId,
        },
      ],
      image: {
        type: String, // Update the data type according to your variant field
        default: "",
      },
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
});

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  locality: {
    type: String,
    required: true,
  },
  landmarks: {
    type: String,
  },
  pincode: {
    type: Number,
    required: true,
  },
});

var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    // cart: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Cart",
    // },
    // wishlist: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Wishlist",
    // },
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    refreshToken: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    company: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
  return resettoken;
};

// const Wishlist = mongoose.model("Wishlist", wishlistSchema);
const Cart = mongoose.model("Cart", cartSchema);
const Address = mongoose.model("Address", addressSchema);
const User = mongoose.model("User", userSchema);
module.exports = { Cart, User, Address };
