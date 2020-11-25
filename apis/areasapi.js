const express = require("express");
const areaRouter = express.Router();
const _ = require("lodash");
const {Area, areaValidation} = require("../modals/area");
const jwt = require("jsonwebtoken"); 
const config = require("config");
const auth = require("../middlewares/adminAuth");
const adminRole = require("../middlewares/adminRole");
const productManagerRole = require("../middlewares/productManagerRole");
const asyncMiddleware = require("../middlewares/asyncerrorhandler")


areaRouter.post("/addnewarea", asyncMiddleware( async(req, res)=>{
 

       const {error} =  areaValidation(req.body);

       if(error) {
           return res.status(400).send(error);
       }


    let area = new Area(

        {
            areaName: req.body.areaName,
            areaCode: req.body.areaCode,
            areaCoordinates: req.body.areaCoordinates
        }
      
    
 );
    try {

        area = await area.save();
       return res.send(area);

    }
    catch(ex)
    {
        console.log(ex.message)
    }
    
}));

module.exports = areaRouter;
