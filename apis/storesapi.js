const express = require("express");
const storesRouter = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const {Store, signupValidation, signinValidation} = require("../modals/store");
const jwt = require("jsonwebtoken"); 
const config = require("config");
const auth = require("../middlewares/customerAuth")
const asyncMiddleware = require("../middlewares/asyncerrorhandler")

storesRouter.get("/me", auth, asyncMiddleware( async (req, res)=>{

    const id = await Store.findById(req.customer._id).select("-password");

    return res.send(id);

}));

storesRouter.post("/signin", asyncMiddleware( async (req, res)=>
{

    const {error} =  signinValidation(req.body);

       if(error) {
           return res.status(400).send(error);
       }
    
    const cust = await Store.findOne({ phone: req.body.phone });
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


storesRouter.post("/addnewstore", asyncMiddleware( async(req, res)=>{

       const {error} =  signupValidation(req.body);

       if(error) {
           return res.status(400).send("Invalid info provided");
       }

    let store = new Store(
        _.pick(req.body, ["storeName", "areaCode", "phone", "password","location"])
 );

     const salt = await bcrypt.genSalt(10);
     store.password = await bcrypt.hash(store.password, salt);

     const token = store.generateAuthToken();
    

    
    try {
        store = await store.save();

        return res.header("x-auth-token", token).send(_.pick(store, ["storeName","phone"]));

    }

    

    catch(ex){
        console.log(ex.message)
             }
    
}));



module.exports = storesRouter;
