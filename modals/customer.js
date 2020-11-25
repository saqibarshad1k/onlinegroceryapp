const mongoose = require("mongoose");
const Joi = require("joi");
const  jwt = require("jsonwebtoken");
const config = require("config");

// const customerSchema = new mongoose.Schema({

//     cart:[{
//         proId: {
//             type: mongoose.Types.ObjectId,
//         required: true,
//         default: null
//     },
//     count: {
//         type: Number,
//         required: true,
//         default: null
//     }
//     }],

//     name:{
//         type: String,
//         maxlength: 30, 
//         minlength: 5,
//         required: true
//     },
//     phone:{
//         type: String,
//         maxlength: 20,
//         minlength: 11,
//         unique: true,
//         required: true
//     },
//     password: {
//         type: String,
//         minlength: 5,
//         maxlength: 1024,
//         required: true
//     },
//     address: {
//         type: String,
//         required: true
//     },
//     location:{
//         type: [Number]
//     }
// });


// extended
const customerSchema = new mongoose.Schema({

    // cart:[{
    //     proId: {
    //         type: mongoose.Types.ObjectId,
    //     required: true,
    //     default: null
    // },
    // count: {
    //     type: Number,
    //     required: true,
    //     default: null
    // }
    // }],

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
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
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




customerSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id, name: this.name, phone: this.phone }, config.get("jwtprivatekey"));
    return token;

}


const Customer = mongoose.model("customer", customerSchema);


// extended

function signupValidation(credentials){
    const schema = {
        // cart: Joi.object(),
        name: Joi.string().min(5).max(30).required(),
        phone: Joi.string().min(11).max(20).required(),
        password: Joi.string().min(8).max(20).required(),
        address: Joi.string().required(),
        location: Joi.object()
        
    }
    return Joi.validate(credentials, schema);
};





// for Talha
// function signupValidation(credentials){
//     const schema = {
//         // cart: Joi.object(),
//         name: Joi.string().min(5).max(30).required(),
//         phone: Joi.string().min(11).max(20).required(),
//         password: Joi.string().min(8).max(20).required(),
//         address: Joi.string().required(),
//         location: Joi.array().items(Joi.number())
        
//     }

//     return Joi.validate(credentials, schema);
// };

function signinValidation(credentials){
    const schema = {
        phone: Joi.string().min(13).max(13).required(),
        password: Joi.string().min(8).max(20).required(),
       
    }

    return Joi.validate(credentials, schema);
};

module.exports.Customer = Customer;
module.exports.signupValidation = signupValidation;
module.exports.signinValidation = signinValidation;


