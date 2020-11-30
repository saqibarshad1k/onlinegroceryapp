const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
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

// extended
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
    mainCategory: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        maincategoryname:{
            type: String,
            required: true

        }
    }
});


// extended
const subsubcategorySchema = new mongoose.Schema({
    subsubcategoryname:{
        type: String,
        minlength:1,
        maxlength:50,
        required: true
    },
    image: {
        type:String
    },
    mainCategory: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        maincategoryname:{
            type: String,
            required: true

        }
    },
    subCategory: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        subcategoryname:{
            type: String,
            required: true

        }
    }
    
});

const productSchema = new mongoose.Schema({

    
    productName:{
        type: String,
        maxlength: 50, 
        minlength: 1,
        required: true
    },
    price:{
        type: String,
        maxlength: 6,
        minlength: 1,
        required: true
    },
    companyName:{
        type: String,
        maxlength: 50,
        minlength: 1,
        required: true
    },
    mainCategory: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        maincategoryname:{
            type: String,
            required: true

        }
    },
    subCategory: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        subcategoryname:{
            type: String,
            required: true

        }
    },
    subsubCategory: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        subsubcategoryname:{
            type: String,
            required: true

        }
    },
    image:{
        type: String,
        default: null
    }
});


const Product = mongoose.model("product", productSchema);
const Maincategory = mongoose.model("maincategory", maincategorySchema);
const Subcategory = mongoose.model("subcategory", subcategorySchema);
const Subsubcategory = mongoose.model("subsubcategory", subsubcategorySchema);


function productValidation(credentials){
    const schema = {
        
        productName: Joi.string().min(1).max(50).required(),
        price: Joi.string().min(1).max(6).required(),
        companyName: Joi.string().min(1).max(50).required(),
        mainCategory: Joi.required(),
        subCategory: Joi.required(),
        subsubCategory: Joi.required(),
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


function subsubcategoryValidation(credentials){
    const schema = {
       
        subsubcategoryname: Joi.string().min(1).max(50).required(),
        mainCategory: Joi.required(),
        subCategory: Joi.required(),
        image: Joi.string()
    }
    return Joi.validate(credentials, schema);
};



function subcategoryValidation(credentials){
    const schema = {
       
        subcategoryname: Joi.string().min(1).max(50).required(),
        mainCategory: Joi.required(),
        image: Joi.string()
    }
    return Joi.validate(credentials, schema);
};


module.exports.Product = Product;
module.exports.ProductSchema = productSchema;
module.exports.Maincategory = Maincategory;
module.exports.Subcategory = Subcategory;
module.exports.Subsubcategory = Subsubcategory;
module.exports.productValidation = productValidation;
module.exports.maincategoryValidation = maincategoryValidation;
module.exports.subcategoryValidation = subcategoryValidation;
module.exports.subsubcategoryValidation = subsubcategoryValidation;


