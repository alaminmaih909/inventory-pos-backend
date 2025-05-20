const User = require("../models/user.model");

exports.authOTPVerify = async (req, res, next) => {
  const phone  = req.params.phone || req.headers.phone || req.body.phone;
       
  const user = await User.findOne({ phone });
  
  if (!user) {
    res.status(404).json({ message: "user not found." });
  } else if (user.isVerified !== true) {
    res.status(401).json({ message: "Unathorized" });
  } else {
    next();
  }
};
