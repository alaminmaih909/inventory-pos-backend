const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  businessID: { type: mongoose.Schema.Types.ObjectId, ref: "business", required: true },
  name: { type: String, required: true, trim: true },
}, { timestamps: true });

const BrandModel = mongoose.model("brand", brandSchema);

module.exports = BrandModel;
