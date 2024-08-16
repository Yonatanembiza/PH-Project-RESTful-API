require("dotenv").config();
const mongoose= require("mongoose");

const museumSchema= new mongoose.Schema({
    first_displayed: {
        name: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    current_location: {
        name: {
            type: String,
            required: true  
        },
        country: {
            type: String,
            required: true
        }
    }
});

const paintingSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    image: {
        type: String,
    },
    museum: {
        type: museumSchema
    }
});

// mongoose.model("Painting", paintingSchema, "paintings");
mongoose.model(process.env.PAINTING_MODEL, paintingSchema, process.env.PAINTING_COLLECTION);