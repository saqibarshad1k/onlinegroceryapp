const jwt  = require("jsonwebtoken");
const config = require("config");


module.exports = function (req, res, next){
    if (!req.admin.isOrderTracker) return res.status(403).send("You cannot perform this operation.")
    next();
}