const { tokenDecodeBusiness } = require("../utils/tokenJWT");

exports.businessChecker = (req, res, next) => {
  // Receive Token
  let token = req.cookies["businessToken"];

  // Token Decode
  let decoded = tokenDecodeBusiness(token);

  // Request Header Email+UserID Add
  if (decoded === null) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  } else {
    let business_id = decoded["business_id"];
    let user_id = decoded["user_id"];

    req.headers.business_id = business_id;
    req.headers.user_id = user_id;
    next();
  }
};
