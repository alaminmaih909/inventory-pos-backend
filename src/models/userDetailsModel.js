const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },
    
    image:{type:String},

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 6 characters"],
    },
    deleteOTP: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("UserDetails", userDetailsSchema);
