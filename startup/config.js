const config = require("config");


module.exports = function(){
    if (!config.get("jwtprivatekey")){
        console.log("Fatal error: JWT key is not set")
        process.exit(1);
        }        
}