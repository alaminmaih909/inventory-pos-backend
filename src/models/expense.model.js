// models/ExpenseModel.js

const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
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
    expenseType: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    note: {
      type: String,
      trim: true,
    },
    expenseDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ExpenseModel = mongoose.model("expense", expenseSchema);

module.exports = ExpenseModel;
