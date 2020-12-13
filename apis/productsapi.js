const express = require("express");
const productRouter = express.Router();
const _ = require("lodash");
const {Product, subsubcategoryValidation, Subsubcategory,  Maincategory, Subcategory, maincategoryValidation, subcategoryValidation, productValidation} = require("../modals/product");
const jwt = require("jsonwebtoken"); 
const config = require("config");
const auth = require("../middlewares/adminAuth");
const adminRole = require("../middlewares/adminRole");
const productManagerRole = require("../middlewares/productManagerRole");
const asyncMiddleware = require("../middlewares/asyncerrorhandler")

// PRODUCTS ENDPOINTS
// ADD NEW PRODUCT
productRouter.post("/addnewproduct", async(req, res)=>{

    const {error} =  productValidation(req.body);

    if(error) {
        return res.status(400).send(error);
    }

    const main = await Maincategory.findOne({_id: req.body.maincategoryname})
    const sub = await Subcategory.findOne({_id: req.body.subcategoryname})
    const subsub = await Subsubcategory.findOne({_id: req.body.subsubcategoryname})
    
    if(!main || !sub || !subsub)
    {
        return res.status(404).send("Invalid data.")
    }

//  let product = new Product(
//      _.pick(req.body, ["productName", "companyName", "price", "subsubCategory", "mainCategory", "subCategory", "image"])
// );

    let product = new Product({
        productName : req.body.productName,
        companyName : req.body.companyName,
        type: req.body.type,
        description: req.body.description,
        price : req.body.price,
        mainCategory: main,
        subCategory: {
            _id: sub._id,
            subcategoryname: sub.subcategoryname
        },
        subsubCategory: {
            _id: subsub._id,
            subsubcategoryname: subsub.subsubcategoryname
        },
        image: req.body.image

    })


 try {
     product = await product.save();
   
    return res.send(product);

 }
 catch(ex){
     console.log(ex.message)
 }
 
});


// GET A PRODUCT

productRouter.get("/getproduct/:id", asyncMiddleware( async(req, res)=>{

    
    const prod = await Product.findOne({_id: req.params.id}); 
    if(!prod) 
    {
        return res.status(404).send("Not found")  ;
   
    }
   
    return res.send(prod);
 
}));


// GET ALL PRODUCTS
productRouter.get("/getallproducts",  async (req, res)=>{



    const products = await Product.find().select("-__v");

    if(!products) return res.status(404).send("Not found")

    return res.send(products);

})


//UPDATE A PRODUCT
productRouter.put("/updateproduct/:id", async (req, res)=>{

    const {error} =  productValidation(req.body);

       if(error) {
           return res.status(400).send(error);
       }

       const main = await Maincategory.findOne({_id: req.body.maincategoryname})
       const sub = await Subcategory.findOne({_id: req.body.subcategoryname})
       const subsub = await Subsubcategory.findOne({_id: req.body.subsubcategoryname})
       
       if(!main || !sub || !subsub)
       {
           return res.status(404).send("Invalid data.")
       }

    const product = await Product.findByIdAndUpdate({_id: req.params.id},{
        $set:{
            productName: req.body.productName,
            companyName: req.body.companyName,
            type: req.body.type,
            description: req.body.description,
            price: req.body.price,
            mainCategory: main,
        subCategory: {
            _id: sub._id,
            subcategoryname: sub.subcategoryname
        },
        subsubCategory: {
            _id: subsub._id,
            subsubcategoryname: subsub.subsubcategoryname
        },
            image: req.body.image

        }
    },{new: true});

    return res.send(product);

});

//DELETE A PRODUCT

productRouter.delete("/deleteproduct/:id", async (req, res) => {
    const prod = await Product.findByIdAndRemove(req.params.id);
  
    if (!prod) return res.status(404).send("Already deleted")
     return  res.send(prod);
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

    if(!mainCate) return res.status(404).send("Not found")

    return res.send(mainCate);
 
});

// GET A MAIN CATEGORY

productRouter.get("/getamaincategory/:id", async(req, res)=>{

    
    const main = await Maincategory.findOne({_id: req.params.id});   
    return res.send(main);
 
});


//UPDATE A MAINCATEGORY
productRouter.put("/updatemaincategory/:id", async (req, res)=>{

    const {error} =  maincategoryValidation(req.body);

       if(error) {
           return res.status(400).send(error);
       }

       const main = await Maincategory.findOne({_id: req.params.id})

       if(!main)
       {
           return res.status(404).send("Main category with this info. does not exsist")
       }

    const maincategory = await Maincategory.findByIdAndUpdate({_id: req.params.id},{
        $set:{
            maincategoryname: req.body.maincategoryname,
            image: req.body.image
        }
    },{new: true});

    return res.send(maincategory);

});


//DELETE A MAINCATEGORY

productRouter.delete("/deletemaincategory/:id", async (req, res) => {
    const maincate = await Maincategory.findByIdAndRemove(req.params.id);
  
    if (!maincate) return res.status(404).send("Already deleted")
     return  res.send(maincate);
  });



// SUB CATEGORY ENDPOINT
// ADD A SUB CATEGORY

productRouter.post("/addsubcategory", async(req, res)=>{
   
    const {error} =  subcategoryValidation(req.body);

    if(error) {
        return res.status(400).send(error);
    }

    main = await Maincategory.findOne({_id: req.body.maincategoryname});

 let newsubcategory = new Subcategory(
     {
         subcategoryname: req.body.subcategoryname,
         image: req.body.image,
         mainCategory: {
             _id: main._id,
             maincategoryname: main.maincategoryname
         },
     });

     newsubcategory = await newsubcategory.save();

     return res.send(newsubcategory);
    });



//DELETE A SUBCATEGORY

productRouter.delete("/deletesubcategory/:id", async (req, res) => {
    const subcate = await Subcategory.findByIdAndRemove(req.params.id);
  
    if (!subcate) return res.status(404).send("Already deleted")
     return  res.send(subcate);
  });    


    
//UPDATE A SUBCATEGORY
productRouter.put("/updatesubcategory/:id", async (req, res)=>{

    const {error} =  subcategoryValidation(req.body);

       if(error) {
           return res.status(400).send(error);
       }

       const main = await Maincategory.findOne({_id: req.body.maincategoryname})

       if(!main)
       {
           return res.status(404).send("Main category with this info. does not exsist")
       }

    const subcategory = await Subcategory.findByIdAndUpdate({_id: req.params.id},{
        $set:{
            subcategoryname: req.body.subcategoryname,
            image: req.body.image,
            mainCategory: {
                _id: main._id,
                maincategoryname: main.maincategoryname
            }
        }
    },{new: true});

    return res.send(subcategory);

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
// ADD A NEW SUB-SUB CATEGORY

productRouter.post("/addsubsubcategory", async(req, res)=>{
   
    const {error} =  subsubcategoryValidation(req.body);

    if(error) {
        return res.status(400).send(error);
    }

     const main = await Maincategory.findOne({_id: req.body.maincategoryname});
     const sub = await Subcategory.findOne({_id: req.body.subcategoryname});

 let newsubsubcategory = new Subsubcategory(
     {
        subsubcategoryname: req.body.subsubcategoryname,
        subCategory: {
            _id: sub._id,
            subcategoryname: sub.subcategoryname
        },
        mainCategory: {
            _id: main._id,
            maincategoryname: main.maincategoryname
        },
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

    
    const subsubCate = await Subsubcategory.findOne({_id: req.params.id});   
    
    
    return res.send(subsubCate);
 
});

//DELETE A SUBSUBCATEGORY

productRouter.delete("/deletesubsubcategory/:id", async (req, res) => {
    const subsubcate = await Subsubcategory.findByIdAndRemove(req.params.id);
  
    if (!subsubcate) return res.status(404).send("Already deleted")
     return  res.send(subsubcate);
  });    


    
//UPDATE A SUBCATEGORY
productRouter.put("/updatesubsubcategory/:id", async (req, res)=>{

    const {error} =  subsubcategoryValidation(req.body);

       if(error) {
           return res.status(400).send(error);
       }

       const main = await Maincategory.findOne({_id: req.body.maincategoryname})

       if(!main)
       {
           return res.status(404).send("Main category with this info. does not exsist")
       }

       const sub = await Subcategory.findOne({_id: req.body.subcategoryname})

       if(!sub)
       {
           return res.status(404).send("Sub category with this info. does not exsist")
       }

    const subsubcategory = await Subsubcategory.findByIdAndUpdate({_id: req.params.id},{
        $set:{
            subsubcategoryname: req.body.subsubcategoryname,
            image: req.body.image,
            mainCategory: {
                _id: main._id,
                maincategoryname: main.maincategoryname
            },
            subCategory: {
                _id: sub._id,
                subcategoryname: sub.subcategoryname
            }
        }
    },{new: true});

    return res.send(subsubcategory);

});





module.exports = productRouter;
