const User = require("../models/user.model");
const {generateOTP} = require("../utils/allSmallutiliy");

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
