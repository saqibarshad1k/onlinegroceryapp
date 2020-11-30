const express = require("express");
const productRouter = express.Router();
const _ = require("lodash");
const {Product, subsubcategoryValidation, Subsubcategory,  Maincategory, Subcategory, maincategoryValidation, subcategoryValidation, productValidation} = require("../modals/product");
const jwt = require("jsonwebtoken"); 
const config = require("config");
const auth = require("../middlewares/adminAuth");
const adminRole = require("../middlewares/adminRole");
const productManagerRole = require("../middlewares/productManagerRole");

// PRODUCTS ENDPOINTS
// ADD NEW PRODUCT
productRouter.post("/addnewproduct", async(req, res)=>{

    const {error} =  productValidation(req.body);

    if(error) {
        return res.status(400).send(error);
    }

 let product = new Product(
     _.pick(req.body, ["productName", "companyName", "price", "subsubCategory", "mainCategory", "subCategory", "image"])
);


 try {
     product = await product.save();
   
    return res.send(product);

 }
 catch(ex){
     console.log(ex.message)
 }
 
});


// GET A PRODUCT

productRouter.get("/getproduct/:id", async(req, res)=>{

    
    const prod = await Product.findOne({_id: req.params.id});   
    return res.send(prod);
 
});


// GET ALL PRODUCTS
productRouter.get("/getallproducts",  async (req, res)=>{



    const products = await Product.find();

    return res.send(products);

})


//UPDATE A PRODUCT
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
            maincategory: req.body.maincategory,
            subcategory: req.body.subcategory,
            image: req.body.image

        }
    },{new: true});

    return res.send(product);

});

//MAIN CATEGORY ENDPOINTS
// ADD A NEW MAIN CATEGORY


productRouter.post("/addmaincategory", async(req, res)=>{
   
    const {error} =  maincategoryValidation(req.body);

    if(error) {
        return res.status(400).send(error);
    }

 let newmaincategory = new Maincategory(
     {
         maincategoryname: req.body.maincategoryname,
         image: req.body.image
     });

     newmaincategory = await newmaincategory.save();

     return res.send(newmaincategory);
    });

// GET ALL MAIN CATEGORIES  

productRouter.get("/getmaincategory", async(req, res)=>{

    
    const mainCate = await Maincategory.find();   
    return res.send(mainCate);
 
});

// GET A MAIN CATEGORY

productRouter.get("/getamaincategory/:id", async(req, res)=>{

    
    const main = await Maincategory.findOne({_id: req.params.id});   
    return res.send(main);
 
});

// SUB CATEGORY ENDPOINT
// ADD A SUB CATEGORY

productRouter.post("/addsubcategory", async(req, res)=>{
   
    const {error} =  subcategoryValidation(req.body);

    if(error) {
        return res.status(400).send(error);
    }

 let newsubcategory = new Subcategory(
     {
         subcategoryname: req.body.subcategoryname,
         mainCategory: req.body.mainCategory,
         image: req.body.image
     });

     newsubcategory = await newsubcategory.save();

     return res.send(newsubcategory);
    });


 //  GET ALL SUB CATEGORIES
 productRouter.get("/getsubcategory", async(req, res)=>{

    
    const subCata = await Subcategory.find();   
    // console.log(`Parameters: ${req.query.params}`);
    // console.log(`Parameters 2: ${req.query}`);
    // console.log(`Body: ${req.body.maincategoryname}`);
    return res.send(subCata);
 
});   
 

// GET A SUBCATEGORY
productRouter.get("/getasubcategory/:id", async(req, res)=>{

    
    const subCate = await Subcategory.findOne({_id: req.params.id});   
    return res.send(subCate);
 
});


// SUB SUB CATEGORY ENDPOINTS
// ADD A NEW SUB CATEGORY

productRouter.post("/addsubsubcategory", async(req, res)=>{
   
    const {error} =  subsubcategoryValidation(req.body);

    if(error) {
        return res.status(400).send(error);
    }

 let newsubsubcategory = new Subsubcategory(
     {
        subsubcategoryname: req.body.subsubcategoryname,
        subCategory: req.body.subCategory,
         mainCategory: req.body.mainCategory,
         image: req.body.image
     });

     newsubsubcategory = await newsubsubcategory.save();

     return res.send(newsubsubcategory);
    });


// GET ALL SUB SUB CATEGORIES
productRouter.get("/getsubsubcategory", async(req, res)=>{

    
    const subsubCata = await Subsubcategory.find();   
    return res.send(subsubCata);
 
});

// GET A SUB SUB CATEGORY

productRouter.get("/getasubsubcategory/:id", async(req, res)=>{

    
    const subsubCate = await SubSubcategory.findOne({_id: req.params.id});   
    return res.send(subsubCate);
 
});







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
