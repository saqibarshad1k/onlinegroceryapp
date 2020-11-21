const mongoose = require("mongoose");
const Joi = require("joi");
const  jwt = require("jsonwebtoken");
const config = require("config");

const maincategorySchema = new mongoose.Schema({
    maincategoryname:{
        type: String,
        minlength:1,
        maxlength:50,
        required: true
    },
    image: {
        type:String
    }
});

const subcategorySchema = new mongoose.Schema({
    subcategoryname:{
        type: String,
        minlength:1,
        maxlength:50,
        required: true
    },
    image: {
        type:String
    },
    maincategoryname:{
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
    maincategory: {
        type: String,
        minlength: 1,
        maxlength: 50,
        required: true
    },
    subcategory: {
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
const Maincategory = mongoose.model("maincategory", maincategorySchema);
const Subcategory = mongoose.model("subcategory", subcategorySchema);

function productValidation(credentials){
    const schema = {
        // cart: Joi.object(),
        productname: Joi.string().min(5).max(50).required(),
        productprice: Joi.string().min(1).max(6).required(),
        companyname: Joi.string().min(5).max(50).required(),
        maincategory: Joi.string().min(1).max(50).required(),
        subcategory: Joi.string().min(1).max(50).required(),
        Type: Joi.string().min(1).max(50).required(),
        image: Joi.string(),
        
    }
   

    return Joi.validate(credentials, schema);
};

function maincategoryValidation(credentials){
    const schema = {
       
        maincategoryname: Joi.string().min(1).max(50).required(),
        image: Joi.string()
    }
   

    return Joi.validate(credentials, schema);
};

function subcategoryValidation(credentials){
    const schema = {
       
        subcategoryname: Joi.string().min(1).max(50).required(),
        maincategoryname: Joi.string().min(1).max(50).required(),
        image: Joi.string()
    }
   

    return Joi.validate(credentials, schema);
};


module.exports.Product = Product;
module.exports.Maincategory = Maincategory;
module.exports.Subcategory = Subcategory;
module.exports.productValidation = productValidation;
module.exports.maincategoryValidation = maincategoryValidation;
module.exports.subcategoryValidation = subcategoryValidation;


