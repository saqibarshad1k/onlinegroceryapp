const express = require("express");
const mongoose = require("mongoose");

// ..
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
   origin: "*",
    methods: ["GET", "POST"]
  }
});



io.of("apis/order/socket").on("connection", (socket) => {
  console.log("socket.io: User connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("socket.io: User disconnected: ", socket.id);
  });
});

io.of("apis/order/socket2").on("connection", (socket) => {
  console.log("socket.io: User connected from socket2: ", socket.id);

  socket.on("disconnect", () => {
    console.log("socket.io: User disconnected from socket2: ", socket.id);
  });
});


        




process.on("uncaughtException", (ex) => {
  console.log("This exception is caught outside express. The error is below:");
  console.log(ex);
  process.exit(1);
});



process.on("unhandledRejection", (ex) => {
    console.log("Unhandled promise rejection from index.js Error is below:");
    console.log(ex);
    process.exit(1);
  });


  mongoose.connect("mongodb+srv://supermart:mart12345@cluster0.sbslu.mongodb.net/<supermart>?retryWrites=true&w=majority", {useCreateIndex:true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true  })
 .then(() => console.log("connected to the database."))
 .catch(err => console.log(`Error:   ${err}`));


 const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connected ------------------");

  console.log("Setting change streams-----------------------");
  const orderChangeStream = connection.collection("orders").watch();

  orderChangeStream.on("change", (change) => {
    switch (change.operationType) {
      case "insert":

        const ODR = change.fullDocument;
        console.log("......" + ODR)

        if(ODR.status === "pending")
        {
          io.of("/apis/order/socket").emit("orderUpdate", ODR);
        }

        io.of("apis/order/socket2").emit("orderUpdate2", "event emitted");
       


        break;

    }
  });
});



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
server.listen(port, () => console.log(`Listening to port ${port}.`));



module.exports.port = port;
