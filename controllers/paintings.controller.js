require("dotenv").config();
const express = require("express");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Painting = mongoose.model(process.env.PAINTING_MODEL);

// Add a painting
const addPainting = function (req, res) {
    const paintingName = req.body.name;

    Painting.findOne({ name: paintingName }).exec(function (error, doc) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
        if (doc) {
            return res.status(409).json({ error: "Painting already exists" });
        }
        Painting.create(req.body, function (error, doc) {
            if (error) {
                return res.status(500).json({ error: error.message || "Internal server error" });
            }
            res.status(201).json(doc);
        });
    });
};

// Add museum information to a painting by ID
const addMuseumByPaintingId = function (req, res) {
    const paintingId = req.params.id;

    Painting.findById(paintingId).exec(function (error, doc) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
        if (!doc) {
            return res.status(404).json({ error: "Painting not found" });
        }
        Painting.updateOne(
            { _id: ObjectId(paintingId) },
            { $push: { museum: req.body } },
            function (error, result) {
                if (error) {
                    return res.status(500).json({ error: error.message || "Internal server error" });
                }
                res.status(200).json(result);
            }
        );
    });
};

// Get a list of paintings with pagination
const getPaintings = function (req, res) {
    const offset = parseInt(req.query.offset, 10) || parseInt(process.env.OFFSET, 10);
    const count = parseInt(req.query.count, 10) || parseInt(process.env.COUNT, 10);

    Painting.find()
        .skip(offset)
        .limit(count)
        .exec(function (error, docs) {
            if (error) {
                return res.status(500).json({ error: error.message || "Internal server error" });
            }
            res.status(200).json(docs);
        });
};

// Get a painting by ID
const getPaintingById = function (req, res) {
    const paintingId = req.params.id;

    Painting.findById(paintingId).exec(function (error, doc) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
        if (!doc) {
            return res.status(404).json({ error: "Painting not found" });
        }
        res.status(200).json(doc);
    });
};

// Get a painting by name
const getPaintingByName = function (req, res) {
    const paintingName = req.params.name;

    Painting.findOne({ name: paintingName }).exec(function (error, doc) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
        if (!doc) {
            return res.status(404).json({ error: "Painting not found" });
        }
        res.status(200).json(doc);
    });
};

// Get the current museum location of a painting by ID
const getCurrentMuseumByPaintingId = function (req, res) {
    const paintingId = req.params.id;

    Painting.findById(paintingId).exec(function (error, doc) {
        if (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
        if (!doc || !doc.museum || !doc.museum.current_location) {
            return res.status(404).json({ error: "Current museum location not found" });
        }
        res.status(200).json(doc.museum.current_location);
    });
};

// Get the former museum location of a painting by ID
const getFormerMuseumByPaintingId = function (req, res) {
    const paintingId = req.params.id;

    Painting.findById(paintingId).exec(function (error, doc) {
        if (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
        if (!doc || !doc.museum || !doc.museum.first_displayed) {
            return res.status(404).json({ error: "Former museum location not found" });
        }
        res.status(200).json(doc.museum.first_displayed);
    });
};

// Get the current museum location of a painting by name
const getCurrentMuseumByPaintingName = function (req, res) {
    const paintingName = req.params.name;

    Painting.findOne({ name: paintingName }).exec(function (error, doc) {
        if (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
        if (!doc || !doc.museum || !doc.museum.current_location) {
            return res.status(404).json({ error: "Current museum location not found" });
        }
        res.status(200).json(doc.museum.current_location);
    });
};

// Get the former museum location of a painting by name
const getFormerMuseumByPaintingName = function (req, res) {
    const paintingName = req.params.name;

    Painting.findOne({ name: paintingName }).exec(function (error, doc) {
        if (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
        if (!doc || !doc.museum || !doc.museum.first_displayed) {
            return res.status(404).json({ error: "Former museum location not found" });
        }
        res.status(200).json(doc.museum.first_displayed);
    });
};

// Update painting by ID
const updatePaintingById = function (req, res) {
    Painting.updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: req.body },
        function (error, result) {
            if (error) {
                return res.status(500).json({ error: "Internal server error" });
            }
            if (!result.matchedCount) {
                return res.status(404).json({ error: "Painting not found" });
            }
            res.status(200).json(result);
        }
    );
};

// Update painting by name
const updatePaintingByName = function (req, res) {
    Painting.updateOne(
        { name: req.params.name },
        { $set: req.body },
        function (error, result) {
            if (error) {
                return res.status(500).json({ error: "Internal server error" });
            }
            if (!result.matchedCount) {
                return res.status(404).json({ error: "Painting not found" });
            }
            res.status(200).json(result);
        }
    );
};

// Update current museum location by painting ID
const updateMuseumByPaintingId = function (req, res) {
    Painting.updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: { "museum.current_location": req.body } },
        function (error, result) {
            if (error) {
                return res.status(500).json({ error: "Internal server error" });
            }
            if (!result.matchedCount) {
                return res.status(404).json({ error: "Painting not found" });
            }
            res.status(200).json(result);
        }
    );
};

// Delete painting by ID
const deletePaintingById = function (req, res) {
    const paintingId = req.params.id;

    Painting.deleteOne({ _id: paintingId }).exec(function (error, result) {
        if (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
        if (!result.deletedCount) {
            return res.status(404).json({ error: "Painting not found" });
        }
        res.status(200).json(result);
    });
};

// Delete painting by name
const deletePaintingByName = function (req, res) {
    const paintingName = req.params.name;

    Painting.deleteOne({ name: paintingName }).exec(function (error, result) {
        if (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
        if (!result.deletedCount) {
            return res.status(404).json({ error: "Painting not found" });
        }
        res.status(200).json(result);
    });
};

// Delete museum information by painting ID
const deleteMuseumByPaintingId = function (req, res) {
    Painting.updateOne(
        { _id: ObjectId(req.params.id) },
        { $pull: { museum: req.body } },
        function (error, result) {
            if (error) {
                return res.status(500).json({ error: "Internal server error" });
            }
            if (!result.matchedCount) {
                return res.status(404).json({ error: "Painting not found" });
            }
            res.status(200).json(result);
        }
    );
};

// Delete museum information by painting name
const deleteMuseumByPaintingName = function (req, res) {
    Painting.updateOne(
        { name: req.params.name },
        { $pull: { museum: req.body } },
        function (error, result) {
            if (error) {
                return res.status(500).json({ error: "Internal server error" });
            }
            if (!result.matchedCount) {
                return res.status(404).json({ error: "Painting not found" });
            }
            res.status(200).json(result);
        }
    );
};

module.exports = {
    addPainting,
    addMuseumByPaintingId,
    getPaintings,
    getPaintingById,
    getPaintingByName,
    getCurrentMuseumByPaintingId,
    getFormerMuseumByPaintingId,
    getCurrentMuseumByPaintingName,
    getFormerMuseumByPaintingName,
    updatePaintingById,
    updatePaintingByName,
    updateMuseumByPaintingId,
    deletePaintingById,
    deletePaintingByName,
    deleteMuseumByPaintingId,
    deleteMuseumByPaintingName
};
