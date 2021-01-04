const express = require("express");
const customersRouter = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const {Customer, signupValidation, signinValidation} = require("../modals/customer");
const jwt = require("jsonwebtoken"); 
const config = require("config");
const auth = require("../middlewares/customerAuth")
const asyncMiddleware = require("../middlewares/asyncerrorhandler")



// const {Order, orderStageOneValidation} = require("../models/order");
// const {MainCata, SubCata, Product, Cart} = require("../models/product")
// var lodash = require('lodash');


customersRouter.get("/me", auth, asyncMiddleware( async (req, res)=>{

    const id = await Customer.findById(req.customer._id).select("-password");
   

    return res.send(id);


}));

customersRouter.post("/signin", asyncMiddleware( async (req, res)=>
{

    const {error} =  signinValidation(req.body);

       if(error) {
           return res.status(400).send(error);
       }
    
    const cust = await Customer.findOne({ phone: req.body.phone });
    console.log(cust);
    if(!cust)
    {     
       return res.status(400).send("Invalid user or password");
        
    }
   
    const validPassword = await bcrypt.compare(req.body.password, cust.password);
    
    if(!validPassword)
    {     
        return res.status(400).send("Invalid user or password");
      
    }

    const token = cust.generateAuthToken();
    
      return res.header("x-auth-token", "lp").send(token);

    

}));


customersRouter.post("/signup", asyncMiddleware( async(req, res)=>{

       const {error} =  signupValidation(req.body);

       if(error) {
           return res.status(400).send("Invalid info provided");
       }

    let customer = new Customer(
        _.pick(req.body, ["name", "phone", "password", "address", "location"])
 );

     const salt = await bcrypt.genSalt(10);
     customer.password = await bcrypt.hash(customer.password, salt);

     const token = customer.generateAuthToken();
    

    
    try {
        customer = await customer.save();
      
       return res.header("x-auth-token", token).send(_.pick(customer, ["name","phone"]));

    }
    catch(ex){
        console.log(ex.message)
    }
    
}));

customersRouter.put("/updatecustomerinfo/:id", auth,asyncMiddleware( async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const cust = await Customer.findByIdAndUpdate({ _id: req.params.id },
        {
            $set: {
                name: req.body.name,
                location: req.body.location,
                address: req.body.address,
                password: req.body.password,
                phone: req.body.phone
            } 
        });
    
        return  res.send(cust);
}));




module.exports = customersRouter;
