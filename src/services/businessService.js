const Business = require("../models/business.model");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

// create a business
exports.createBusinessService = async (req, res) => {
  try {
    const userID = req.headers.user_id;
    const { businessName, phone, email, address, website } = req.body;

    const createdBusiness = await Business.create({
      userID: userID,
      businessName: businessName,
      phone: phone,
      email: email,
      address: address,
      website: website,
    });

    if (createdBusiness) {
      res.status(201).json({ message: "New business is created" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// get All Business List
exports.getAllBusinessService = async (req, res) => {
  try {
    const userID = req.headers.user_id;
    const businesses = await Business.find({userID:userID});

    if (!businesses) res.status(404).json({message:"No business found, Please create new business"});

    res.status(200).json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get a single Business
exports.getBusinessService = async (req,res) => {
    try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(200).json(updatedBusiness);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// business deletaion request, send otp in user phone and email;
exports.deleteBusinessReqService = async (req,res) => {
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

    await sendSMS({
      to: user.phone,
      message: `Your ${business.businessName} business deletion OTP is: ${otp}`,
    });

    res.json({ message: "OTP sent to your email & Phone number" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}

// confirm delete bsuiness
exports.deleteBusinessService = async (req,res) => {
    try {
    const { otp,password } = req.body;
    const user = await User.findById(req.headers.user_id);

    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const match_password = await bcrypt.compare(password,user.password);

    if(!match_password) res.status(401).json({message:"Wrong password, try again"});

    await Business.findOneAndDelete(req.params.id);

    res.json({ message: "Business deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}