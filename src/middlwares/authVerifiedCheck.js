const User = require("../models/userModel")

exports.authOTPVerify = async (req,res,next)=>{

   let phone = req.headers.phone;

   const user = await User.findOne({phone});

   if(user.isVerified !== true){

    res.status(401).json({message: "Unathorized"})
   }

   
    next();
  
}