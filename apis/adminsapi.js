const express = require("express");
const adminsRouter = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const {Admin, signupValidation, signinValidation} = require("../modals/admin");
const jwt = require("jsonwebtoken"); 
const config = require("config");
const auth = require("../middlewares/adminAuth");
const asyncMiddleware = require("../middlewares/asyncerrorhandler")



adminsRouter.get("", auth, asyncMiddleware(async (req, res) =>{

    return res.send("ok");

}));

adminsRouter.get("/me", auth, asyncMiddleware( async (req, res)=>{

    const id = await Admin.findById(req.admin._id).select("-password");

    return res.send(id);

}));

adminsRouter.post("/signin", asyncMiddleware( async  (req, res)=>
{

    const {error} =  signinValidation(req.body);

       if(error) {
           return res.status(400).send(error);
       }
    
    const admin = await Admin.findOne({ phone: req.body.phone });
    console.log(admin);
    if(!admin)
    {     
       return res.status(400).send("Invalid phone or password");
        
    }

 
   
    const validPassword = await bcrypt.compare(req.body.password, admin.password);
    
    if(!validPassword)
    {     
        return res.status(400).send("Invalid phone or password");
      
    }

    const token = admin.generateAuthToken();
    
      return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(token);

    

}));





adminsRouter.post("/signup", asyncMiddleware( async(req, res)=>{

       const {error} =  signupValidation(req.body);

       if(error) {
           return res.status(400).send(error);
       }

       const ald = await Admin.findOne({phone: req.body.phone})
       if(ald) {
           return res.status(400).send("A user with this phone has already registered")
       }

    let admin = new Admin(
        _.pick(req.body, ["name", "phone", "password"])
 );

     const salt = await bcrypt.genSalt(10);
     admin.password = await bcrypt.hash(admin.password, salt);

     

    
    try {
        admin = await admin.save();
      
       return res.send(_.pick(admin, ["name","phone"]));

    }
    catch(ex){
        console.log(ex.message)
    }
    
}));


module.exports = adminsRouter;
