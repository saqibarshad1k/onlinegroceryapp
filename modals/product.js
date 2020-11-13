const mongoose = require("mongoose");
const Joi = require("joi");
const  jwt = require("jsonwebtoken");
const config = require("config");

const maincatagorySchema = new mongoose.Schema({
    maincatagoryname:{
        type: String,
        minlength:1,
        maxlength:50,
        required: true
    }
});

const subcatagorySchema = new mongoose.Schema({
    subcatagoryname:{
        type: String,
        minlength:1,
        maxlength:50,
        required: true
    },
    maincatagoryname:{
        type: String,
        minlength:1,
        maxlength:50,
        required: true
    }
});




const productSchema = new mongoose.Schema({

    
    productname:{
        type: String,
        maxlength: 50, 
        minlength: 5,
        required: true
    },
    productprice:{
        type: String,
        maxlength: 6,
        minlength: 1,
        required: true
    },
    companyname:{
        type: String,
        maxlength: 50,
        minlength: 5,
        required: true
    },
    maincatagory: {
        type: String,
        minlength: 1,
        maxlength: 50,
        required: true
    },
    subcatagory: {
        type: String,
        minlength: 1,
        maxlength: 50,
        required: true
    },
    image:{
        type: String,
        default: null
    },
    Type:{
        type: String,
        minlength: 1,
        maxlength: 50,
        required: true
    }
});





const Product = mongoose.model("product", productSchema);
const Maincatagory = mongoose.model("maincatagory", maincatagorySchema);
const Subcatagory = mongoose.model("subcatagory", subcatagorySchema);

function productValidation(credentials){
    const schema = {
        // cart: Joi.object(),
        productname: Joi.string().min(5).max(50).required(),
        productprice: Joi.string().min(1).max(6).required(),
        companyname: Joi.string().min(5).max(50).required(),
        maincatagory: Joi.string().min(1).max(50).required(),
        subcatagory: Joi.string().min(1).max(50).required(),
        Type: Joi.string().min(1).max(50).required(),
        image: Joi.string(),
        
    }
   

    return Joi.validate(credentials, schema);
};

function maincatagoryValidation(credentials){
    const schema = {
       
        maincatagoryname: Joi.string().min(1).max(50).required(),
       
    }
   

    return Joi.validate(credentials, schema);
};

function subcatagoryValidation(credentials){
    const schema = {
       
        subcatagoryname: Joi.string().min(1).max(50).required(),
        maincatagoryname: Joi.string().min(1).max(50).required()
       
    }
   

    return Joi.validate(credentials, schema);
};


module.exports.Product = Product;
module.exports.Maincatagory = Maincatagory;
module.exports.Subcatagory = Subcatagory;
module.exports.productValidation = productValidation;
module.exports.maincatagoryValidation = maincatagoryValidation;
module.exports.subcatagoryValidation = subcatagoryValidation;


