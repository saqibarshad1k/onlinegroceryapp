module.exports = function(err, req, res, next){
   return res.status(500).send("Some error occured inside express. The error is below:");
}