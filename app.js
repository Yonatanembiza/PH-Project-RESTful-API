require("dotenv").config();
require("./api/data/db");
const cors= require("cors");
const routes= require("./rouets/index");
const path= require("path");
const express= require("express");

const app= express();

// middlewares
// to parse json data
app.use(express.json()); 
app.use(cors());
// logging
app.use(function(req, res, next){
    console.log(req.method, req.url);
    next();
});
// for static pages
app.use(express.static(path.join(__dirname, process.env.STATIC_FOLDER)));
// routes to resources
app.use("/api", routes);

// running server
const server= app.listen(process.env.PORT, function(){
    console.log(process.env.SERVER_START_MESSAGE, server.address().port);
});