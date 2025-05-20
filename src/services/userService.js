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
      return res.status(400).json({ message: "Phone number is required" });
    }

    let user = await User.findOne({ phone });

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

    res.status(200).json({ message: "OTP sent successfully", phone });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// verify user with OTP Service
exports.verifyOTPService = async (req, res) => {
  try {
    const { otp } = req.body;
    const phone = req.params.phone;

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

    res
      .status(200)
      .json({ message: "Phone number verified successfully, Thanks" });
  } catch (error) {
    console.error("OTP verify error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


//re Send Otp Service
exports.reSendOtpService = async (req,res) => {

  try {
    const phone  = req.params.phone;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Check if user is blocked, how many time need to wait that's show in frontend
    if (user.otpRequestBlockedUntil && user.otpRequestBlockedUntil > new Date()) {
      const waitMinutes = Math.ceil((user.otpRequestBlockedUntil - new Date()) / 60000);

      user.otp = null;
      user.otpExpires = null;
       await user.save();
       
      return res.status(429).json({
        message: `Too many OTP requests. Please try again after ${waitMinutes} minutes.`,
      });
    }

    // Increment OTP request count
    user.otpRequestCount += 1;

    // If more than 3 requests, block user for 1 hour
    if (user.otpRequestCount >= 5) {
      user.otpRequestBlockedUntil = new Date(Date.now() + 60 * 60 * 1000); // 1 hour block
      user.otpRequestCount = 0; // reset count
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      return res.status(429).json({
        message: "Too many OTP requests. You are blocked for 1 hour.",
      });
    }


    // generate otp 
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 মিনিট

    // update user data
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // ✅ এখানে SMS/email পাঠানোর কোড যুক্ত করতে পারো
    // await sendSms(phone, `Your OTP is ${otp}`);

    res.status(200).json({
      message: "OTP resent successfully",
      otp: otp, // production এ এটি পাঠাবে না, কনসোলে দেখাবে বা sms/email করবে
    });

  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}


// Post User Details Service
exports.userDetailsService = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !password) {
      return res.status(400).json({ message: "Name & Password required" });
    }

    let phone = req.params.phone;
    const user = await User.findOne({ phone });

    // Check if user already exists
    // const existingUser = await UserDetails.findOne({ phone: user.phone });
    if (!user) {
      return res.status(409).json({ message: "User not found" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.name = name;
    user.email = email;
    user.password = hashedPassword;

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login User with phone and password
exports.loginUserService = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match_user = await bcrypt.compare(password, user.password);
    if (!match_user)
      return res.status(400).json({ message: "Wrong password!" });

    const token = tokenEncode(phone, user._id);

    res.cookie("token", token, {
    /*   httpOnly: true, */
     /*  sameSite: "Strict", */
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

// User forget password request
exports.forgetPasswordReqService = async (req, res) => {
  try {
    const phone = req.body.phone;
    const user = await User.findOne({ phone });

    if (!user) res.status(400).json({ message: "User not found" });

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

    res.json({ message: "Check your phone or email for otp" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// newPasswordService
exports.newPasswordService = async (req, res) => {
  try {
    const { password1, password2 } = req.body;
    const phone = req.params.phone;

 if (!password1 || !password2 || ( password2 !== password1)) {
      res.status(400).json({ message: "Something went to wrong" });
    }

    const user = await User.findOne({ phone });
    if (!user) res.status(400).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password2, 10);

    user.password = hashedPassword;

    user.save();

    res.status(201).json({ message: "Your Password is changed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// User change password service
exports.changePasswordService = async (req, res) => {
  try {
    const { password1, password2 , password3 } = req.body;
    const phone = req.headers.phone;


    if (!password1 || !password2 || !password3 || ( password3 !== password2)) {
      res.status(400).json({ message: "Something went to wrong, Retry" });
    }

    const user = await User.findOne({ phone });
     
    const match_user = await bcrypt.compare(password1, user.password);
    

    if(!match_user) res.status(401).json({message:"Unathorized"});
    

    const hashedPassword = await bcrypt.hash(password3, 10);

    user.password = hashedPassword;

    user.save();
    
    res.cookie("token", "", { maxAge: 0 });
    res.status(201).json({ message: "Your Password is changed, please login" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// user profile get
exports.getProfileService = async (req, res) => {
  try {
    let phone = req.headers.phone;
    const user = await User.findOne({ phone });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Update user profile
exports.updateProfileService = async (req, res) => {
  try {
    const updates = req.body;
    const userID = req.headers.user_id;
      
  // block some feild, for could not update
  const disallowedFields = ["password", "otp", "otpExpires", "isVerified","otpRequestCount","otpRequestBlockedUntil"];
    for (let key of disallowedFields) {
      if (updates.hasOwnProperty(key)) {
        return res.status(400).json({ message: `Cannot update field: ${key}` });
      }
    }


    const user = await User.findByIdAndUpdate(userID, updates,{new:true});

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
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

    res.json({ message: "OTP sent to your email & Phone number" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
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
    res.cookie("token", "", { maxAge: 0 });

    res.json({ message: "Account deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
