const mongoose = require("mongoose");
const Joi = require("joi");
const  jwt = require("jsonwebtoken");
const config = require("config");

// extended
const areaSchema = new mongoose.Schema({

    areaName:{
        type: String,
        maxlength: 30, 
        minlength: 1,
        required: true
    },
    areaCode: {
        type: String,
        minlength: 1,
        maxlength: 20,
        required: true
    },
    areaCoordinates: {
        lat: Number,
        long: Number
    }
});


const Area = mongoose.model("area", areaSchema);


// extended

function areaValidation(credentials){
    const schema = {
        // cart: Joi.object(),
        areaName: Joi.string().min(1).max(30).required(),
        areaCode: Joi.string().min(1).max(20).required(),
        areaCoordinates: Joi.required()
        
    }
    return Joi.validate(credentials, schema);
};

module.exports.Area = Area;
module.exports.areaValidation = areaValidation;


