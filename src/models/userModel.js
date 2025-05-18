const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },

    image: { type: String , default: null},

    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
    },
    otp: {
      type: String,
      default: "000000",
    },
    otpExpires: {
      type: Date,
      default: null,
    },
      isVerified: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
