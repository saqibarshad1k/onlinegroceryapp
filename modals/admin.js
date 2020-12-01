const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId =  require("joi-objectid")(Joi);
const  jwt = require("jsonwebtoken");
const config = require("config");
const { debounce } = require("lodash");

// customer schema attribites:
// 1. name = min(5), max (15) ,required
// 2. email = min (15), max(30), required
// 4. phone = min(11), max(20), required
// 5. password = max(1024), required (encrypted)


const adminSchema = new mongoose.Schema({



    name:{
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
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: true
    },
    
    isAdmin:{
        type: Boolean,
        default: true
    },
    isProductManager:{
        type: Boolean,
        default: true
    },
    isOrderTraker:{
        type: Boolean,
        default: true
    }
});

adminSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin, isProductManager: this.isProductManager, isOrderTraker: this.isOrderTraker }, config.get("jwtprivatekey"));
    return token;

}


const Admin = mongoose.model("admin", adminSchema);

function signupValidation(credentials){
    const schema = {
        // cart: Joi.object(),
        name: Joi.string().min(5).max(30).required(),
        phone: Joi.string().min(11).max(20).required(),
        password: Joi.string().min(2).max(20).required(),
        // isAdmin: Joi.boolean(),
        // isProductManager: Joi.boolean(),
        // isOrderTraker: Joi.boolean(),
        
    }
   

    return Joi.validate(credentials, schema);
};

function signinValidation(credentials){
    const schema = {
        phone: Joi.string().min(11).max(11).required(),
        password: Joi.string().min(8).max(20).required(),
       
    }

    return Joi.validate(credentials, schema);
};

module.exports.Admin = Admin;
module.exports.signupValidation = signupValidation;
module.exports.signinValidation = signinValidation;


