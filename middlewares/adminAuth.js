const jwt  = require("jsonwebtoken");
const config = require("config");


module.exports = function (req, res, next){
    const token = req.header("x-auth-token");
    if(!token) return res.status(401).send("Access denied. No token provided.");
   console.log(token);
try {
    const decodedpayload  = jwt.verify(token, config.get("jwtprivatekey"));
    req.admin = decodedpayload;
    next();
}
    
catch (ex){
   return  res.status(400).send("Invalid token.")
}

}