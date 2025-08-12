// models/SalesModel.js

const mongoose = require("mongoose");

// sold product item schema
const soldProductSchema = new mongoose.Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  warrantySerialNo: [{
    type: String,
    default: ""
  }],
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  sellPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
});

// main sales schema
const salesSchema = new mongoose.Schema(
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
    customerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
    invoiceNo: {
      type: String,
      required: true,
      trim: true,
    },
    products: [soldProductSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "mobilebanking"],
      default: "cash",
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SalesModel = mongoose.model("sales", salesSchema);

module.exports = SalesModel;
