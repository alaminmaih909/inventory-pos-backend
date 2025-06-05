const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  businessID: { type: mongoose.Schema.Types.ObjectId, ref: "business", required: true },
  name: { type: String, required: true, trim: true },
}, { timestamps: true });

const CategoryModel = mongoose.model("category", categorySchema);

module.exports = CategoryModel;
