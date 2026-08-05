import mongoose from "mongoose";

// One schema, one collection ("products"), with `category` as a plain field.

const CATEGORIES = [
  "clothes",
  "gym-equipment",
  "home-appliances",
  "pc-setup",
  "furniture",
];

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
      index: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    salePrice: {
      type: Number,
      min: 0,
    },

    onSale: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Don't use "isNew" because Mongoose already uses that internally.
    isNewArrival: {
      type: Boolean,
      default: false,
      index: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    sizes: {
      type: [String],
      default: [],
    },

    colors: {
      type: [String],
      default: [],
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    gallery: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    details: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure sale products always have a sale price
productSchema.pre("validate", function () {
  if (this.onSale && this.salePrice == null) {
    throw new Error("onSale is true but salePrice is missing");
  }
  if (this.salePrice != null && this.salePrice > this.price) {
    throw new Error("salePrice cannot be greater than price");
  }
});

// Helpful indexes for common queries
productSchema.index({ category: 1, onSale: 1 });
productSchema.index({ name: "text", brand: "text" });

export const CATEGORY_LIST = CATEGORIES;
export const Product = mongoose.model("Product", productSchema, "products");