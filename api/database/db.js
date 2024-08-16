require("dotenv").config();
const mongoose= require("mongoose");
require("../components/user/data/users-model");
require("../components/painting/data/paintings-model");

mongoose.connect(process.env.DATABASE_CONNECTION_URL, {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

 mongoose.connection.on("connected", function() {
    console.log("Mongoose connected to "+ process.env.DATABASE_NAME);
 });

 mongoose.connection.on("disconnected", function() {
    console.log("Mongoose disconnected");
 });

 mongoose.connection.on("error", function(error) {
    console.log("Mongoose connection error "+ error);
 });

 process.on("SIGINT", function() {
    mongoose.connection.close(function() {
    console.log(process.env.SIGINT_MESSAGE);
    process.exit(0);
    });
});
process.on("SIGTERM", function() {
    mongoose.connection.close(function() {
    console.log(process.env.SIGTERM_MESSAGE);
    process.exit(0);
    });
});
process.once("SIGUSR2", function() {
    mongoose.connection.close(function() {
    console.log(process.env.SIGUSR2_MESSAGE);
    process.kill(process.pid, "SIGUSR2");
    });
});