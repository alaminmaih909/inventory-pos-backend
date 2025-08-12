const { tokenEncode } = require("../utils/tokenJWT");
const {
  generateOTP,
  sendOTPBySMS,
  sendSMS,
} = require("../utils/allSmallutiliy");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");

const sendEmail = require("../utils/nodeMail");

// sign up a user
exports.signUpUserService = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ status:"Failed", message: "Phone number is required" });
    }
    
    
    let user = await User.findOne({ phone });

    if(user) {
      return res.status(400).json({status:"Failed", message: "User Already Exist, try new" });

    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 mins

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

    // await sendOTPBySMS(phone, otp);

    /*    // set phone in headers for verify otp
    let Phone = user.phone;
    req.headers.phone = Phone; */

    return res.status(200).json({status:"Success", message: "OTP sent successfully", phone });
  } catch (error) {
    // console.error("Register error:", error);
    return res.status(500).json({status:"Failed", message: error.message  });
  }
};

// Post User Details Service
exports.userDetailsService = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !password) {
      return res.status(400).json({ status:"Failed" ,message: "Name & Password required" });
    }

    let phone = req.params.phone;
    const user = await User.findOne({ phone });

    // Check if user already exists
    // const existingUser = await UserDetails.findOne({ phone: user.phone });
    if (!user) {
      return res.status(409).json({status:"Failed" , message: "User not found" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.name = name;
    user.email = email;
    user.password = hashedPassword;

    await user.save();

    return res.status(201).json({
      status:"Success" ,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({status:"Failed" , message: "Server error" });
  }
};

// Login User with phone and password
exports.loginUserService = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    if (!user) return res.status(404).json({status:"Failed", message: "User not found" });

    const match_user = await bcrypt.compare(password, user.password);
    if (!match_user)
      return res.status(400).json({status:"Failed", message: "Wrong password!" });

    const token = tokenEncode(phone, user._id);

    // res.cookie("token", token, {
    // /*   httpOnly: true, */
    //  /*  sameSite: "Strict", */
    //   maxAge: 180 * 24 * 60 * 60 * 1000, // 6 months
    // });

    return res
      .cookie("token", token, {
        /*   httpOnly: true, */
        /*  sameSite: "Strict", */
        maxAge: 180 * 24 * 60 * 60 * 1000, // 6 months
      })
      .json({status:"Success", message: "Login successful" });
  } catch (err) {
    return res
      .status(500)
      .json({status:"Failed", message: "Server Error", error: err.message });
  }
};

// Logout user
exports.logoutUserService = async (req, res) => {
  return res
    .cookie("token", "", { maxAge: 0 })
    .json({ status:"Success", message: "Logged out successfully" });
};

// User forget password request
exports.forgetPasswordReqService = async (req, res) => {
  try {
    const phone = req.body.phone;
    const user = await User.findOne({ phone });

    if (!user) return res.status(400).json({ status:"Failed",message: "User not found" });

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send Email
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: "Reset Your Password",
        text: `Your OTP to reset password is: ${otp}`,
      });
    }

    // Send SMS

    await sendSMS({
      to: user.phone,
      message: `Your OTP to reset password is: ${otp}`,
    });

    return res.json({ status:"Success", message: "Check your phone or email for otp" });
  } catch (err) {
    return res
      .status(500)
      .json({status:"Failed", message: "Server Error", error: err.message });
  }
};

// newPasswordService
exports.newPasswordService = async (req, res) => {
  try {
    const { password1, password2 } = req.body;
    const phone = req.params.phone;

    if (!password1 || !password2 || password2 !== password1) {
      return res.status(400).json({ message: "Something went to wrong" });
    }

    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password2, 10);

    user.password = hashedPassword;

    user.save();

    return res.status(201).json({ message: "Your Password is changed" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

// User change password service
exports.changePasswordService = async (req, res) => {
  try {
    const { password1, password2, password3 } = req.body;
    const phone = req.headers.phone;

    if (!password1 || !password2 || !password3 || password3 !== password2) {
      return res
        .status(400)
        .json({ message: "Something went to wrong, Retry" });
    }

    const user = await User.findOne({ phone });

    const match_user = await bcrypt.compare(password1, user.password);

    if (!match_user) return res.status(401).json({ message: "Unathorized" });

    const hashedPassword = await bcrypt.hash(password3, 10);

    user.password = hashedPassword;

    user.save();

    return res
      .cookie("token", "", { maxAge: 0 })
      .status(201)
      .json({ message: "Your Password is changed, please login" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// user profile get
exports.getProfileService = async (req, res) => {
  try {
    let phone = req.headers.phone;
    const user = await User.findOne({ phone });
    return res.json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

// Update user profile
exports.updateProfileService = async (req, res) => {
  try {
    const updates = req.body;
    const userID = req.headers.user_id;

    // block some feild, for could not update
    const disallowedFields = [
      "password",
      "otp",
      "otpExpires",
      "isVerified",
      "otpRequestCount",
      "otpRequestBlockedUntil",
    ];
    for (let key of disallowedFields) {
      if (updates.hasOwnProperty(key)) {
        return res.status(400).json({ message: `Cannot update field: ${key}` });
      }
    }

    const user = await User.findByIdAndUpdate(userID, updates, { new: true });

    return res.json({ message: "Profile updated", user });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

// user account delete request
exports.requestAccountDeletionService = async (req, res) => {
  try {
    const otp = generateOTP();
    const user = await User.findById(req.headers.user_id);

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // expires in 10 minutes
    await user.save();

    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: "Confirm Account Deletion",
        text: `Your account deletion OTP is: ${otp}`,
      });
    }

    await sendSMS({
      to: user.phone,
      message: `Your account deletion OTP is: ${otp}`,
    });

    return res.json({ message: "OTP sent to your email & Phone number" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

// confirm user account deletaion
exports.confirmAccountDeletionService = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.headers.user_id);

    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await User.findOneAndDelete(req.headers.user_id);
    return res
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Account deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
