const Business = require("../models/business.model");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const {generateOTP} = require("../utils/allSmallutiliy");
const {tokenEncodeBusiness} = require ("../utils/tokenJWT.js");

// create a business
exports.createBusinessService = async (req, res) => {
  try {
    const userID = req.headers.user_id;
    const { businessName, phone, email, address, website } = req.body;

    const user = await User.findById({_id:userID});
    
    const newBusiness = await Business.create({
      userID: userID,
      ownerName: user.name,
      businessName,
      phone: phone,
      email,
      address,
      website,
    });

    if (newBusiness) {
     return res.status(201).json({ status:"Success", message: "New business is created", newBusiness });
    }
  } catch (error) {
     return res.status(500).json({ status:"Failed", message: "Server error", error });
  }
};

// get All Business List
exports.getAllBusinessService = async (req, res) => {
  try {
    const userID = req.headers.user_id;
    const businesses = await Business.find({ userID: userID });

    if (!businesses)
     return res
        .status(404)
        .json({ status:"Failed", message: "No business found, Create a new business" });

     return res.status(200).json({status:"Success",businesses});
  } catch (error) {
     return res.status(500).json({ status:"Failed", message: error.message });
  }
};

// get a single Business
exports.getBusinessService = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    return res.status(200).json(business);
  } catch (error) {
    return  res.status(500).json({ message: error.message });
  }
};

// dashboard Service
exports.dashboardService = async (req,res) => {
    try {
      const userID = req.headers.user_id;
      const businessID = req.params.id;
 
      const businessToken = tokenEncodeBusiness(userID,businessID);

       return res
      .cookie("businessToken", businessToken, {
          httpOnly: true,
        /*  sameSite: "Strict", */
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      }).json({message:"Dashboard"});
  } catch (error) {
    return  res.status(500).json({ message: error.message });
  }
}
// update bsuiness data
exports.updateBusinessService = async (req, res) => {
  try {
    const updatedBusiness = await Business.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBusiness) {
      return res.status(404).json({ message: "Business not found" });
    }
    return res.status(200).json(updatedBusiness);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// business deletaion request, send otp in user phone and email;
exports.deleteBusinessReqService = async (req, res) => {
  try {
    const user = await User.findById(req.headers.user_id);
    const business = await Business.findById(req.params.id);

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // expires in 10 minutes
    await user.save();

    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: `Confirm ${business.businessName} Business Deletion`,
        text: `Your business deletion OTP is: ${otp}`,
      });
    }

   /*  await sendSMS({
      to: user.phone,
      message: `Your ${business.businessName} business deletion OTP is: ${otp}`,
    });
 */
   return res.json({ message: "OTP sent to your email & Phone number" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// confirm delete business
exports.deleteBusinessService = async (req, res) => {
  try {
    const { otp, password } = req.body;

    const user = await User.findById({ _id: req.headers.user_id });

    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const match_password = await bcrypt.compare(password, user.password);

    if (!match_password) {
      return res.status(401).json({ message: "Wrong password, try again" });
    }

    await Business.findOneAndDelete({ _id: req.params.id });

    return res.json({ message: "Business deleted permanently" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};
