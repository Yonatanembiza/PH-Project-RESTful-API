require("dotenv").config();
const express = require("express");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Painting= mongoose.model(process.env.PAINTING_MODEL);

const addPainting= function(req, res) {
    const paintingName= req.body.name;

    
    Painting.findOne({name: paintingName}).exec(function(error, doc) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
        if (doc) {
            return res.status(409).json({ error: "Painting already exists" });
        }
        // insert new painting
        Painting.create(req.body, function(error, doc) {
            if (error) {
                return res.status(500).json({ error: error.message || "Internal server error" });
            }
            console.log("Painting created successfully");
            return res.status(201).json(doc);
        });
    });
};

const addMuseumByPaintingId= function(req, res) {
    const paintingId= req.params.id;
    Painting.findById(paintingId).exec(function(error, doc) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
        if (!doc) {
            return res.status(404).json({ error: "Painting not found" });
        }
        Painting.updateOne(
            { _id: ObjectId(req.params.id) },
            { $push: { museum: req.body } },
            function(error, doc) {
                if (error) {
                    return res.status(500).json({ error: error.message || "Internal server error" });
                }
                res.status(200).json(doc);
            }
        );
    })
    
};

const getPaintings= function(req, res) {
    let offset = parseInt(req.query.offset) || parseInt(process.env.OFFSET);
    let count = parseInt(req.query.count) || parseInt(process.env.COUNT);
    Painting
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(error, docs) {
            if (error) {
                return res.status(500).json({ error: error.message || "Internal server error" });
            }
            res.status(200).json(docs);
        });
};

const getPaintingById = function(req, res) {
    const paintingId= req.params.id;
    console.log("Get painting by id: " + paintingId);
    Painting.findById(paintingId).exec(function(error, doc) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal error" });
        }
        if (!doc) {
            return res.status(404).json({ error: "Painting not found" });
        }
        res.status(200).json(doc);
    });
};

// get painting by name
const getPaintingByName = function(req, res) {
    const paintingName= req.params.name;
    Painting.findOne({name: paintingName}).exec(function(error, doc) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal error" });
        }
        if (!doc) {
            return res.status(404).json({ error: "Painting not found" });
        }
        res.status(200).json(doc);
    });
};

// get the current museum by painting id
const getCurrentMuseumByPaintingId = function(req, res) {
    const paintingId= req.params.id;
    
    Painting.findById(paintingId).exec(function(error, doc) {
        if (error) {
            return res.status(500).json({ error: "Internal error" });
        }
        if (!doc || !doc.museum || !doc.museum.current_location) {
            return res.status(404).json({ error: "Not found" });
        }
        return res.status(200).json(doc.museum.current_location);
    });
};

// get the former-museum by painting id
const getFormerMuseumByPaintingId = function(req, res) {
    const paintingId= req.params.id;
    
    Painting.findById(paintingId).exec(function(error, doc) {
        if (error) {
            return res.status(500).json({ error: "Internal error" });
        }
        if (!doc || !doc.museum || !doc.museum.first_displayed) {
            return res.status(404).json({ error: "Not found" });
        }
        return res.status(200).json(doc.museum.first_displayed);
    });
};

// get the current museum by painting name
const getCurrentMuseumByPaintingName = function(req, res) {
    const paintingName= req.params.name;
    
    Painting.findOne({ name: paintingName }).exec(function(error, doc) {
        if (error) {
            return res.status(500).json({ error: "Internal error" });
        }
        if (!doc || !doc.museum || !doc.museum.current_location) {
            return res.status(404).json({ error: "Not found" });
        }
        return res.status(200).json(doc.museum.current_location);
    });
};

// get the former museum by painting name
const getFormerMuseumByPaintingName = function(req, res) {
    const paintingName= req.params.name;
    Painting.findOne({ name: paintingName }).exec(function(error, doc) {
        if (error) {
            return res.status(500).json({ error: "Internal error" });
        }
        if (!doc || !doc.museum || !doc.museum.first_displayed) {
            return res.status(404).json({ error: "Not found" });
        }
        return res.status(200).json(doc.museum.first_displayed);
    });
};

// Update --> Put
// update painting by id
const updatePaintingById = function(req, res) {
    
    Painting.updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: req.body },
        function(error, doc) {
            if (error) {
                return res.status(500).json({ error: "Internal error" });
            }
            if (!doc.matchedCount) {
                return res.status(404).json({ error: "Painting not found" });
            }
            res.status(200).json(doc);
        }
    );
};

// update painting by name
const updatePaintingByName = function(req, res) {
    
    Painting.updateOne(
        { name: req.params.name },
        { $set: req.body },
        function(error, doc) {
            if (error) {
                return res.status(500).json({ error: "Internal error" });
            }
            if (!doc.matchedCount) {
                return res.status(404).json({ error: "Painting not found" });
            }
            res.status(200).json(doc);
        }
    );
};

// update museum by painting id
const updateMuseumByPaintingId = function(req, res) {
    
    Painting.updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: { "museum.current_location": req.body } },
        function(error, doc) {
            if (error) {
                return res.status(500).json({ error: "Internal error" });
            }
            if (!doc.matchedCount) {
                return res.status(404).json({ error: "Painting not found" });
            }
            res.status(200).json(doc);
        }
    );
};

// Delete
const deletePaintingById = function(req, res) {
    const paintingId= req.params.id;
    Painting.deleteOne({ _id: paintingId}).exec(function(error, doc) {
        if (error) {
            return res.status(500).json({ error: "Internal error" });
        }
        if (!doc.deletedCount) {
            return res.status(404).json({ error: "Painting not found" });
        }
        return res.status(200).json(doc);
    });
};

const deletePaintingByName = function(req, res) {
    const paintingName= req.params.name;
    Painting.deleteOne({ name: paintingName }).exec(function(error, doc) {
        if (error) {
            return res.status(500).json({ error: "Internal error" });
        }
        if (!doc.deletedCount) {
            return res.status(404).json({ error: "Painting not found" });
        }
        return res.status(200).json(doc);
    });
};

const deleteMuseumByPaintingId = function(req, res) {
    Painting.updateOne(
        { _id: ObjectId(req.params.id) },
        { $pop: { museum: req.body } },
        function(error, doc) {
            if (error) {
                return res.status(500).json({ error: "Internal error" });
            }
            if (!doc.matchedCount) {
                return res.status(404).json({ error: "Painting not found" });
            }
            res.status(200).json(doc);
        }
    );
};

const deleteMuseumByPaintingName = function(req, res) {
    
    Painting.updateOne(
        { name: req.params.name },
        { $pop: { museum: req.body } },
        function(error, doc) {
            if (error) {
                return res.status(500).json({ error: "Internal error" });
            }
            if (!doc.matchedCount) {
                return res.status(404).json({ error: "Painting not found" });
            }
            res.status(200).json(doc);
        }
    );
};

// exporting the module
module.exports= {
    addPainting: addPainting,
    addMuseumByPaintingId: addMuseumByPaintingId,

    getPaintings: getPaintings,
    getPaintingById: getPaintingById,
    getPaintingByName: getPaintingByName,
    getCurrentMuseumByPaintingId: getCurrentMuseumByPaintingId,
    getCurrentMuseumByPaintingName: getCurrentMuseumByPaintingName,
    getFormerMuseumByPaintingId: getFormerMuseumByPaintingId,
    getFormerMuseumByPaintingName: getFormerMuseumByPaintingName,

    updatePaintingById: updatePaintingById,
    updatePaintingByName: updatePaintingByName,
    updateMuseumByPaintingId: updateMuseumByPaintingId,

    deletePaintingById: deletePaintingById,
    deletePaintingByName: deletePaintingByName,
    deleteMuseumByPaintingId: deleteMuseumByPaintingId,
    deleteMuseumByPaintingName: deleteMuseumByPaintingName
}
