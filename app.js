require("dotenv").config();
const path= require("path");
const express= require("express");

const app= express();

// middlewares
// to parse json data
app.use(express.json()); 
// logging
app.use(function(req, res, next){
    console.log(req.method, req.url);
    next();
});
// for static pages
app.use(express.static(path.join(__dirname, process.env.STATIC_FOLDER)));

const server= app.listen(process.env.PORT, function(){
    console.log(process.env.SERVER_START_MESSAGE, server.address().port);
});