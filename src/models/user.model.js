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
      match: [
        /^01[3-9]\d{8}$/,
        "Please provide a valid Bangladeshi phone number",
      ],
    },
      email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      required:false,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    }, 
 
    image: { type: String, default: null },

    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "staff"],
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    otpRequestCount: {
      type: Number,
      default: 0,
    },
    otpRequestBlockedUntil: {
      type: Date,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("user", userSchema);
