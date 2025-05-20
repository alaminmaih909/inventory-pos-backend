const {tokenDecode} = require("../utils/tokenJWT")

exports.authVerify = (req,res,next)=>{

    // Receive Token
    let token= req.cookies['token'];


  // Token Decode
  let decoded=tokenDecode(token);

  // Request Header Email+UserID Add
  if(decoded===null){
      return res.status(401).json({status:"fail", message:"Unauthorized"})
  }
  else {
    let phone=decoded['phone'];
    let user_id=decoded['user_id'];

    req.headers.phone=phone;
    req.headers.user_id=user_id;
    next();
  }
}