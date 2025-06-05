const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    totalPurchase: {
      type: Number,
      default: 0,
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    totalDue: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CustomerModel = mongoose.model("customer", customerSchema);

module.exports = CustomerModel;