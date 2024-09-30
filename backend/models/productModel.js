import mongoose from "mongoose";
import slugify from "slugify";
import Category from "./categoryModel.js";
import SubCategory from "./subCategory.js";
import validator from "validator";



const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
      maxlength: [
        40,
        "Product name must have less or equal then 40 characters",
      ],
      minlength: [3, "Product name must have more or equal then 3 characters"],
      //validate: [validator.isAlpha, "Product name must not contain numbers"],
    },
    slug: String,
    brand: {
      type: String,
      required: true,
      trim: true,
      maxlength: [40, "Brand must have less or equal then 40 characters"],
      minlength: [3, "Brand name must have more or equal then 10 characters"],
      //validate: [validator.isAlpha, "Brand name must not contain numbers"],
    },
    Category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    SubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    isFeatured: {
      type: Boolean,
      required: true,
      default: false,
    },

    description: {
      type: String,
      required: true,
      maxlength: [
        1000,
        "Description must have less or equal then 1000 characters",
      ],
      minlength: [10, "Description must have more or equal then 10 characters"],
    },

    price: {
      type: Number,
      required: [true, "Product must have a price"],
    },
    discount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 3.0,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    colors: {
      type: [String],
      default:[]
    },
    sizes: {
      type: [String],
      default:[]
    },
    images: {
      required: true,
      type: [String],
    },

    countInStock: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.pre("save", async function (next) {
  if (this.SubCategory) {
    try {
      const check = await SubCategory.findById(this.SubCategory);
      if (
        !check ||
        JSON.stringify(check.Category) !== JSON.stringify(this.Category)
      ) {
        throw new Error("Check your Category and/or SubCategory");
      }
    } catch (error) {
      throw error;
    }
  }
  next();
});
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

const Product = mongoose.model("Product", productSchema);

export default Product;
