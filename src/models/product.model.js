const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    businessID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productCode: {
      type: String,
      uppercase: true,
    },
    unit: {
      type: String,
      required: true,
      enum: ["pcs", "kg", "ltr", "box", "packet", "other"],
      default: "pcs",
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      default: "No Brand",
      trim: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    alertQuantity: {
      type: Number,
      default: 5,
      min: 0,
    },
    discountType: {
      type: String,
      enum: ["percentage", "flat", "none"],
      default: "none",
    },

    discountValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    warrantyType: {
      type: String,
      enum: ["none", "days", "months", "years"],
      default: "none",
    },
    warrantyDuration: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProductModel = mongoose.model("product", productSchema);

module.exports = ProductModel;
