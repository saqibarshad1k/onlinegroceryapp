const express = require("express");
const adminsRouter = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const {Admin, signupValidation, signinValidation} = require("../modals/admin");
const jwt = require("jsonwebtoken"); 
const config = require("config");
const auth = require("../middlewares/adminAuth");
const asyncMiddleware = require("../middlewares/asyncerrorhandler")


// const {Order, orderStageOneValidation} = require("../models/order");
// const {MainCata, SubCata, Product, Cart} = require("../models/product")
// var lodash = require('lodash');



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
    
      return res.header("x-auth-token", token).send(token);

    

}));





adminsRouter.post("/signup", asyncMiddleware( async(req, res)=>{

       const {error} =  signupValidation(req.body);

       if(error) {
           return res.status(400).send(error);
       }

    let admin = new Admin(
        _.pick(req.body, ["name", "phone", "password", "address", "location"])
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



// adminsRouter.get("/getuserdata/:id", async(req, res)=>{
    
//     const data = await admin.findById(req.params.id);

//     res.send(data);

// })

// adminsRouter.get("/getmaincatagory", async(req, res)=>{

    
//     const mainCata = await MainCata.find();   
//     res.send(mainCata);
 
// })



// adminsRouter.get("/getproducts/:id", async(req, res)=>{

    
//     const pro = await Product.find({subCatagory:req.params.id});   
//     res.send(pro);
 
// })

// adminsRouter.get("/getsubcatagory/:id", async(req, res)=>{

    
//        const subCata = await SubCata.find({mainCatagory:req.params.id});   
//        res.send(subCata);
    
// })



// adminsRouter.post("/addtocart", async (req, res)=>{


//    const c = await admin.findById({"_id": req.body.userId},{"cart.proId": req.body.proId});

//    let d = lodash.filter(c.cart, {"proId": "5e2e37d161cb64220c71882f"})

//    res.send(d);

//     });

// const c =  await admin.findOneAndUpdate({ _id: req.body.userId }, 
//     { $push:
//         { cart :
//             { proId: req.body.proId, count: "0"  }
//         }
//         });

   

// adminsRouter.post("/orders", async(req, res)=>{

//     const {error} =  orderStageOneValidation(req.body);

//     if(error) {
//         return res.status(400).send(error);
//     }




//  let order = new Order({
//      adminID: req.body.adminID,
//      order: req.body.order

//  });

//  order = await order.save();
 
//  res.send(order);

// });



module.exports = adminsRouter;
