const express = require("express");
const productRouter = express.Router();
const _ = require("lodash");
const {Product, Maincatagory, Subcatagory, maincatagoryValidation, subcatagoryValidation, productValidation} = require("../modals/product");
const jwt = require("jsonwebtoken"); 
const config = require("config");
const auth = require("../middlewares/adminAuth");
const adminRole = require("../middlewares/adminRole");
const productManagerRole = require("../middlewares/productManagerRole");




productRouter.get("/getsubcatagory", async(req, res)=>{

    
    const subCata = await Subcatagory.find({maincatagoryname: req.body.maincatagory});   
    return res.send(subCata);
 
});




productRouter.get("/getallproducts",  async (req, res)=>{



    const products = await Product.find();

    return res.send(products);

})


productRouter.put("/updateproduct/:id", async (req, res)=>{

    const {error} =  productValidation(req.body);

       if(error) {
           return res.status(400).send(error);
       }

    const product = await Product.findByIdAndUpdate({_id: req.params.id},{
        $set:{
            productname: req.body.productname,
            companyname: req.body.companyname,
            productprice: req.body.productprice,
            maincatagory: req.body.maincatagory,
            subcatagory: req.body.subcatagory,
            Type: req.body.Type,
            image: req.body.image

        }
    },{new: true});

    return res.send(product);

});

productRouter.post("/addnewproduct", async(req, res)=>{

       const {error} =  productValidation(req.body);

       if(error) {
           return res.status(400).send(error);
       }

    let product = new Product(
        _.pick(req.body, ["productname", "companyname", "productprice", "maincatagory", "subcatagory", "image", "Type"])
 );


    try {
        product = await product.save();
      
       return res.send(product);

    }
    catch(ex){
        console.log(ex.message)
    }
    
});

productRouter.get("/getmaincatagory", async(req, res)=>{

    
    const mainCata = await Maincatagory.find();   
    return res.send(mainCata);
 
});

productRouter.post("/addmaincatagory", async(req, res)=>{
   
    const {error} =  maincatagoryValidation(req.body);

    if(error) {
        return res.status(400).send(error);
    }

 let newmaincatagory = new Maincatagory(
     {
         maincatagoryname: req.body.maincatagoryname,
         image: req.body.image
     });

     newmaincatagory = await newmaincatagory.save();

     return res.send(newmaincatagory);
    });

  
 

productRouter.get("/getsubcatagory", async(req, res)=>{

    
    const subCata = await Subcatagory.find();   
    return res.send(subCata);
 
});

productRouter.post("/addsubcatagory", async(req, res)=>{
   
    const {error} =  subcatagoryValidation(req.body);

    if(error) {
        return res.status(400).send(error);
    }

 let newsubcatagory = new Subcatagory(
     {
         subcatagoryname: req.body.subcatagoryname,
         maincatagoryname: req.body.maincatagoryname,
         image: req.body.image
     });

     newsubcatagory = await newsubcatagory.save();

     return res.send(newsubcatagory);
    });
 





// productRouter.get("/getuserdata/:id", async(req, res)=>{
    
//     const data = await Product.findById(req.params.id);

//     res.send(data);

// })





// productRouter.get("/getproducts/:id", async(req, res)=>{

    
//     const pro = await Product.find({subCatagory:req.params.id});   
//     res.send(pro);
 
// });

// productRouter.get("/getsubcatagory/:id", async(req, res)=>{

    
//        const subCata = await SubCata.find({mainCatagory:req.params.id});   
//        res.send(subCata);
    
// })



// productRouter.post("/addtocart", async (req, res)=>{


//    const c = await Product.findById({"_id": req.body.userId},{"cart.proId": req.body.proId});

//    let d = lodash.filter(c.cart, {"proId": "5e2e37d161cb64220c71882f"})

//    res.send(d);

//     });

// const c =  await Product.findOneAndUpdate({ _id: req.body.userId }, 
//     { $push:
//         { cart :
//             { proId: req.body.proId, count: "0"  }
//         }
//         });

   

// productRouter.post("/orders", async(req, res)=>{

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



module.exports = productRouter;
