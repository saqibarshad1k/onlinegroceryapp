const express = require("express");
const deliveryWorkersRouter = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const {DeliveryWorker, signupValidation, signinValidation} = require("../modals/deliveryWorker");
const jwt = require("jsonwebtoken"); 
const config = require("config");
const auth = require("../middlewares/customerAuth")
const asyncMiddleware = require("../middlewares/asyncerrorhandler")

deliveryWorkersRouter.get("/me", auth, asyncMiddleware( async (req, res)=>{

    const id = await DeliveryWorker.findById(req.customer._id).select("-password");

    return res.send(id);

}));

deliveryWorkersRouter.post("/signin", asyncMiddleware( async (req, res)=>
{

    const {error} =  signinValidation(req.body);

       if(error) {
           return res.status(400).send(error);
       }
    
    const cust = await DeliveryWorker.findOne({ phone: req.body.phone });
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


deliveryWorkersRouter.get("/get", asyncMiddleware( async(req, res) =>{

    return res.send("Depolyment working successfully.")
}));


deliveryWorkersRouter.post("/addnewworker", asyncMiddleware( async(req, res)=>{

       const {error} =  signupValidation(req.body);

       if(error) {
           return res.status(400).send(error);
       }

    let deliveryWorker = new DeliveryWorker(
        _.pick(req.body, ["name", "phone", "password", "areaCode", "location"])
 );

     const salt = await bcrypt.genSalt(10);
     deliveryWorker.password = await bcrypt.hash(deliveryWorker.password, salt);

     const token = deliveryWorker.generateAuthToken();
    

    
    try {
        deliveryWorker = await deliveryWorker.save();
      
       return res.header("x-auth-token", token).send(_.pick(deliveryWorker, ["name","phone"]));

    }
    catch(ex){
        console.log(ex.message)
    }
    
}));

deliveryWorkersRouter.put("/updatecustname/:id", auth,asyncMiddleware( async (req, res) => {

    const cust = await DeliveryWorker.findByIdAndUpdate({ _id: req.params.id },
        {
            $set: {
                name: req.body.name
            } 
        });
    
        return  res.send(cust);
}));

deliveryWorkersRouter.put("/updatecustlocation/:id", auth, asyncMiddleware( async (req, res) => {

    const cust = await DeliveryWorker.findByIdAndUpdate({ _id: req.params.id },
        {
            $set: {
                location: req.body.location
            } 
        });
    
        return  res.send(cust);
}));

deliveryWorkersRouter.put("/updatecustphone/:id", auth, asyncMiddleware( async (req, res) => {

    const cust = await DeliveryWorker.findByIdAndUpdate({ _id: req.params.id },
        {
            $set: {
                phone: req.body.phone
            } 
        });
    
        return  res.send(cust);
}));

deliveryWorkersRouter.put("/updatecustaddress/:id", auth,asyncMiddleware( async (req, res) => {

    const cust = await DeliveryWorker.findByIdAndUpdate({ _id: req.params.id },
        {
            $set: {
                address: req.body.address
            } 
        });
    
        return  res.send(cust);
}));

deliveryWorkersRouter.put("/updatecustpassword/:id", auth, asyncMiddleware( async (req, res) => {

    var cust = await DeliveryWorker.findById({ _id: req.params.id });

    const salt = await bcrypt.genSalt(10);
    cust.password = await bcrypt.hash(req.body.password, salt);



     cust = await cust.save();


    
        return  res.send(cust);
}));



module.exports = deliveryWorkersRouter;
