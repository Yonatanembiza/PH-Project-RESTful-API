require("dotenv").config();
require("./backend/database/db");
const cors= require("cors");
const routesUsers= require("./backend/components/user/route/index");
const routesPaintings= require("./backend/components/painting/route/index");
const path= require("path");
const express= require("express");

const app= express();
app.use(cors());
// parse json data
app.use(express.json()); 
// logging
app.use(function(req, res, next){
    console.log(req.method, req.url);
    next();
});
// static pages
app.use(express.static(path.join(__dirname, process.env.STATIC_FOLDER)));

// routes
app.use("/api", routesPaintings);
app.use("/api", routesUsers);

// server
const server= app.listen(process.env.PORT, function(){
    console.log(process.env.SERVER_START_MESSAGE, server.address().port);
});