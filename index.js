const express = require("express");
const mongoose = require("mongoose");



const app = express();

process.on("uncaughtException", (ex) => {
  console.log("uncaugth exception IS DOWN THERE");
  console.log(ex);
  process.exit(1);
});

// throw new Error("error occured");

process.on("unhandledRejection", (ex) => {
    console.log("unhandled promise");
    console.log(ex);
    process.exit(1);
  });


  mongoose.connect("mongodb+srv://supermart:mart12345@cluster0.sbslu.mongodb.net/test", {useCreateIndex:true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true  })
 .then(() => console.log("connected to the database."))
 .catch(err => console.log(`Error:   ${err}`));



//  mongoose.connect("mongodb://localhost/mart", {useCreateIndex:true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true  })
//  .then(() => console.log("connected to the database."))
//  .catch(err => console.log(`Error:   ${err}`));

// const p = Promise.reject(new Error("Failed miserably"));
// p.then(() => console.log("done"));

//  throw new Error("lskjnvonvevrv")
  

require("./startup/routers")(app);
require("./startup/prod")(app);
require("./startup/config")(app);

 
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening to port ${port}.`));


module.exports.port = port;
