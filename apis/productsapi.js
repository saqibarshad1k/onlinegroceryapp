const express = require("express");
const productRouter = express.Router();
const _ = require("lodash");
const {Product,  Maincategory, Subcategory, maincategoryValidation, subcategoryValidation, productValidation} = require("../modals/product");
const jwt = require("jsonwebtoken"); 
const config = require("config");
const auth = require("../middlewares/adminAuth");
const adminRole = require("../middlewares/adminRole");
const productManagerRole = require("../middlewares/productManagerRole");




productRouter.get("/getsubcategory", async(req, res)=>{

    
    const subCate = await Subcategory.find({maincategoryname: req.body.maincategoryname});   
    return res.send(subCate);
 
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
            maincategory: req.body.maincategory,
            subcategory: req.body.subcategory,
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

productRouter.get("/getmaincategory", async(req, res)=>{

    
    const mainCate = await Maincategory.find();   
    return res.send(mainCate);
 
});

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

  
 

productRouter.get("/getsubcategory", async(req, res)=>{

    
    const subCata = await Subcategory.find();   
    return res.send(subCata);
 
});

productRouter.post("/addsubcategory", async(req, res)=>{
   
    const {error} =  subcategoryValidation(req.body);

    if(error) {
        return res.status(400).send(error);
    }

 let newsubcategory = new Subcategory(
     {
         subcategoryname: req.body.subcategoryname,
         maincategoryname: req.body.maincategoryname,
         image: req.body.image
     });

     newsubcategory = await newsubcategory.save();

     return res.send(newsubcategory);
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
