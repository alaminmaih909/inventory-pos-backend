const jwt = require("jsonwebtoken");

exports.tokenEncode = (phone,user_id)=>{
       let key = process.env.JWT_SECRET;
       let exphire = {expiresIn: process.env.JWT_EXPHIRE} ;
       let payLoad = {phone:phone,user_id:user_id};

       return jwt.sign(payLoad, key, exphire);

}

exports.tokenDecode = (token) =>{
    try {
        let Key = process.env.JWT_SECRET;
        return jwt.verify(token,Key);
    }
    catch (e) {
        return null
    }
}

exports.tokenEncodeBusiness = (user_id,business_id)=>{
       let key = process.env.JWT_SECRET;
       let exphire = {expiresIn: "24h"} ;
       let payLoad = {user_id:user_id,business_id:business_id};

       return jwt.sign(payLoad, key, exphire);

}

exports.tokenDecodeBusiness = (token) =>{
    try {
        let Key = process.env.JWT_SECRET;
        return jwt.verify(token,Key);
    }
    catch (e) {
        return null
    }
}