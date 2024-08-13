require("dotenv").config();
const mongoose= require("mongoose");

const userSchema= new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

mongoose.model(process.env.USER_MODEL, userSchema, process.env.USER_COLLECTION);