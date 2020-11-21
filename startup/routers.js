const express = require("express");
const cors = require('cors')

const customersRouter = require("../apis/customersapi");
const adminRouter = require("../apis/adminsapi");
const productRouter = require("../apis/productsapi");
const orderRouter = require("../apis/ordersapi");

const error = require("../middlewares/error");
// const adminRouter = require("../apis/admin");

module.exports = function(app){

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use("/apis/customer", customersRouter);
app.use("/apis/admin", adminRouter);
app.use("/apis/product", productRouter);
app.use("/apis/order", orderRouter);
app.use(error);

// app.use("/apis/admin", adminRouter);

}