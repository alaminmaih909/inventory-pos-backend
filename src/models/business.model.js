const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
    },
    logo: {
      type: String, // image URL
      default: null,
    },
    website: {
      type: String,
    },
    subscription: {
      packageName: { type: String, default: "Free" },
      startDate: { type: Date, default: Date.now },
      endDate: {
        type: Date,
        default: function () {
          return new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days use for free
        },
      },
      isActive: { type: Boolean, default: true },
    },
    smsCredits: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("business", businessSchema);
