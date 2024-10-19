 const express = require("express");
 const app = express();
 const cors = require("cors");
 const pool = require("./db");
 const path = require("path");


 //middleware
 app.use(cors());

 //get data from client
 app.use(express.json()); //req.body

 //ROUTES

 //registration and login
 app.use("/auth", require("./routes/JWTauth"));
 
 //dashboard route
 app.use("/dashboard", require("./routes/dashboard"));

 app.use("/uploads", express.static(path.join(__dirname, "uploads")));

 app.listen(5000, () => {
    console.log("server has started on port 5000");
 });
