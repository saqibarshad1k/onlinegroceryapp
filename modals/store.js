const mongoose = require("mongoose");
const Joi = require("joi");
const  jwt = require("jsonwebtoken");
const config = require("config");

// extended
const storeSchema = new mongoose.Schema({

    storeName:{
        type: String,
        maxlength: 30, 
        minlength: 5,
        required: true
    },
    phone:{
        type: String,
        maxlength: 20,
        minlength: 11,
        unique: true,
        required: true
    },
    areaCode: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: true
    },
    location:{
        lat: Number,
        long: Number
    },
    status:{
        type: String,
        default: "available"
    }
});




storeSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id, name: this.name, phone: this.phone }, config.get("jwtprivatekey"));
    return token;

}


const Store = mongoose.model("store", storeSchema);


// extended

function signupValidation(credentials){
    const schema = {
        // cart: Joi.object(),
        storeName: Joi.string().min(5).max(30).required(),
        phone: Joi.string().min(11).max(20).required(),
        password: Joi.string().min(8).max(20).required(),
        location: Joi.required(),
        areaCode: Joi.required()

        
    }
    return Joi.validate(credentials, schema);
};



function signinValidation(credentials){
    const schema = {
        phone: Joi.string().min(13).max(13).required(),
        password: Joi.string().min(8).max(20).required(),
       
    }

    return Joi.validate(credentials, schema);
};

module.exports.Store = Store;
module.exports.signupValidation = signupValidation;
module.exports.signinValidation = signinValidation;


