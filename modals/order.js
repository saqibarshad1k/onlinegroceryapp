const mongoose = require("mongoose");
const Joi = require("joi");
const  jwt = require("jsonwebtoken");
const config = require("config");

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
            type: mongoose.Types.ObjectId,
        required: true,
        default: null
    },
    orderitems:[{
        productID: {
            type: mongoose.Types.ObjectId,
        required: true,
        default: null
    },
    quantity: {
        type: Number,
        required: true,
        default: null
    }
    }]
});







const Order = mongoose.model("order", orderSchema);

function orderValidation(credentials){
    const schema = {
        // cart: Joi.object(),
    
        customer: Joi.string().required(),
        orderitems : Joi.array().items({
            productID: Joi.string(),
            quantity: Joi.number()  
          })
        
    }
   

    return Joi.validate(credentials, schema);
};



module.exports.Order = Order;
module.exports.orderValidation = orderValidation;



