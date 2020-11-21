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
    
      return res.header("x-auth-token", "tttt").send(token);

    

}));


customersRouter.get("/get", asyncMiddleware( async(req, res) =>{

    return res.send("Depolyment working successfully.")
}));


customersRouter.post("/signup", asyncMiddleware( async(req, res)=>{

       const {error} =  signupValidation(req.body);

       if(error) {
           return res.status(400).send("Lun pe char bc");
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

customersRouter.put("/updatecustname/:id", auth,asyncMiddleware( async (req, res) => {

    const cust = await Customer.findByIdAndUpdate({ _id: req.params.id },
        {
            $set: {
                name: req.body.name
            } 
        });
    
        return  res.send(cust);
}));

customersRouter.put("/updatecustlocation/:id", auth, asyncMiddleware( async (req, res) => {

    const cust = await Customer.findByIdAndUpdate({ _id: req.params.id },
        {
            $set: {
                location: req.body.location
            } 
        });
    
        return  res.send(cust);
}));

customersRouter.put("/updatecustphone/:id", auth, asyncMiddleware( async (req, res) => {

    const cust = await Customer.findByIdAndUpdate({ _id: req.params.id },
        {
            $set: {
                phone: req.body.phone
            } 
        });
    
        return  res.send(cust);
}));

customersRouter.put("/updatecustaddress/:id", auth,asyncMiddleware( async (req, res) => {

    const cust = await Customer.findByIdAndUpdate({ _id: req.params.id },
        {
            $set: {
                address: req.body.address
            } 
        });
    
        return  res.send(cust);
}));

customersRouter.put("/updatecustpassword/:id", auth, asyncMiddleware( async (req, res) => {

    var cust = await Customer.findById({ _id: req.params.id });

    const salt = await bcrypt.genSalt(10);
    cust.password = await bcrypt.hash(req.body.password, salt);



     cust = await cust.save();


    
        return  res.send(cust);
}));





// customersRouter.get("/getuserdata/:id", async(req, res)=>{
    
//     const data = await Customer.findById(req.params.id);

//     res.send(data);

// })

// customersRouter.get("/getmaincatagory", async(req, res)=>{

    
//     const mainCata = await MainCata.find();   
//     res.send(mainCata);
 
// })



// customersRouter.get("/getproducts/:id", async(req, res)=>{

    
//     const pro = await Product.find({subCatagory:req.params.id});   
//     res.send(pro);
 
// })

// customersRouter.get("/getsubcatagory/:id", async(req, res)=>{

    
//        const subCata = await SubCata.find({mainCatagory:req.params.id});   
//        res.send(subCata);
    
// })



// customersRouter.post("/addtocart", async (req, res)=>{


//    const c = await Customer.findById({"_id": req.body.userId},{"cart.proId": req.body.proId});

//    let d = lodash.filter(c.cart, {"proId": "5e2e37d161cb64220c71882f"})

//    res.send(d);

//     });

// const c =  await Customer.findOneAndUpdate({ _id: req.body.userId }, 
//     { $push:
//         { cart :
//             { proId: req.body.proId, count: "0"  }
//         }
//         });

   

// customersRouter.post("/orders", async(req, res)=>{

//     const {error} =  orderStageOneValidation(req.body);

//     if(error) {
//         return res.status(400).send(error);
//     }




//  let order = new Order({
//      custID: req.body.custID,
//      order: req.body.order

//  });

//  order = await order.save();
 
//  res.send(order);

// });



module.exports = customersRouter;
