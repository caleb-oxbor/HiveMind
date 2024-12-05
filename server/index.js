const express = require("express");
const app = express();
const cors = require("cors");
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

 //create post route
app.use("/create-post", require("./routes/createpost"));

 //view posts route
app.use("/view-posts", require("./routes/viewposts"));

 //download route
app.use("/download", require("./routes/download"));

 //upvote/downvote
app.use("/votes", require("./routes/votes"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/profile", require("./routes/profile"));


app.listen(5000, () => {
   console.log("server has started on port 5000");
});
