const mongoose = require("mongoose");
const Joi = require("joi");
const  jwt = require("jsonwebtoken");
const config = require("config");
const { ProductSchema } = require("./product")

const Cust = new mongoose.Schema({
    

    name:{
        type: String,
        maxlength: 30, 
        minlength: 5,
        required: true
    },
    phone:{
        type: String,
        unique: false,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location:{
        lat: Number,
        long: Number
    }
});





const orderSchema = new mongoose.Schema({

    status: {
        type: String,
        required: true,
        default: "pending"
    },
    ordertime:{
        type: Date,
        default: Date.now
    },
    customer: {
            type: Cust,
            required: true,
            unique: false
    },
    orderitems:[{
        product: {
           type: ProductSchema,
           required: true
        },
        quantity: {
        type: Number,
        required: true,
        default: null
    }
    }],
    total: {
        type: Number,
        required: true
    }
});







const Order = mongoose.model("order", orderSchema);

function orderValidation(credentials){
    const schema = {
        // cart: Joi.object(),
    
        customer: Joi.required(),
        orderitems : Joi.required(),
        total: Joi.required()
        
    }
   

    return Joi.validate(credentials, schema);
};



module.exports.Order = Order;
module.exports.orderValidation = orderValidation;



