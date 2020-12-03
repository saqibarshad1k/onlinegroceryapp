const mongoose = require("mongoose");
const Joi = require("joi");
const  jwt = require("jsonwebtoken");
const config = require("config");
const { ProductSchema } = require("./product");
const deliveryWorkersRouter = require("../apis/deliveryWorkerapi");

const Cust = new mongoose.Schema({

    custID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

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

const storeSchema = new mongoose.Schema({

    storeID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    storeName:{
        type: String,
        maxlength: 30, 
        minlength: 5,
        required: true
    },
    phone:{
        type: String,
        maxlength: 20,
        minlength: 13,
        required: true
    },
    location:{
        lat: Number,
        long: Number
    }
    
});

const deliveryWorkerSchema = new mongoose.Schema({

    deliveryWorkerID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
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
           prodID:{
               type: mongoose.Schema.Types.ObjectId,
               required: true 
           },
           productName: {
               type: String,
               required: true
           },
           companyName: {
               type: String,
               required: true
           },
           image:{
               type: String,
               required: true
           },
           price:{
               type: Number,
               required: true
           }
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
    },
    store:{
        type: storeSchema,
        required: true

    },
    deliveryWorker:{
        type: deliveryWorkerSchema,
        required: true

    }
});







const Order = mongoose.model("order", orderSchema);

function orderValidation(credentials){
    const schema = {
        // cart: Joi.object(),
    
        customer: Joi.required(),
        orderitems : Joi.required(),
        total: Joi.required(),
        store: Joi.required(),
        deliveryWorker: Joi.required()
        
    }
   

    return Joi.validate(credentials, schema);
};



module.exports.Order = Order;
module.exports.orderValidation = orderValidation;



