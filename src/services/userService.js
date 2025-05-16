const { tokenEncode } = require("../utils/tokenJWT");
const { generateOTP, sendOTPBySMS } = require("../utils/allSmallutiliy");
const bcrypt = require("bcryptjs");

const UserDetails = require("../models/userDetailsModel")
const User = require("../models/userModel");

const sendEmail = require("../utils/nodeMail");

// sign up a user 
exports.signUpUserService = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    let user = await User.findOne({ phone });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 mins

    if (!user) {
      // New user
      user = new User({
        phone,
        otp,
        otpExpires,
        isVerified: false,
      });
    } 

    await user.save();

    await sendOTPBySMS(phone, otp);

    // set phone in headers for verify otp
    let Phone = user.phone;
     req.headers.phone= Phone;    

    res.status(200).json({ message: "OTP sent successfully", phone });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// verify user with OTP Service
exports.verifyOTPService = async (req,res) => {
  try {
    const { otp } = req.body;
    const phone = req.headers.phone;

    if (!otp) {
      return res.status(400).json({ message: "OTP required" });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.status(200).json({ message: "Phone number verified successfully, Thanks" });
  } catch (error) {
    console.error("OTP verify error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

// Post User Details Service 
exports.userDetailsService = async (req,res) => {
 try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !password) {
      return res.status(400).json({ message: "Name & Password required" });
    }
    
    let phone = req.headers.phone;
    const user = await User.findOne({phone})

    // Check if user already exists
    const existingUser = await UserDetails.findOne({ phone : user.phone });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this Phone Number" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserDetails({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

// Login User with phone and password
exports.loginUserService = async (req, res) => {
  try {
    const { phone , password } = req.body;
    const user = await UserDetails.findOne({ phone });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match_user = await bcrypt.compare(password, user.password);
    if (!match_user)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = tokenEncode(phone, user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 180 * 24 * 60 * 60 * 1000, // 6 months
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Logout user 
exports.logoutUserService = async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.json({ message: "Logged out successfully" });
};

// user profile get
exports.getProfileService = async (req, res) => {
  try {

    let phone = req.headers.phone;
    const user = await UserDetails.findOne ({phone});
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};



exports.updateProfileService = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.requestAccountDeletionService = async (req, res) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.findById(req.user.id);

    user.deleteOTP = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // expires in 10 minutes
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Confirm Account Deletion",
      text: `Your account deletion OTP is: ${otp}`,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.confirmAccountDeletionService = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || user.deleteOTP !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await User.findByIdAndDelete(req.user.id);
    res.cookie("token", "", { maxAge: 0 });

    res.json({ message: "Account deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
