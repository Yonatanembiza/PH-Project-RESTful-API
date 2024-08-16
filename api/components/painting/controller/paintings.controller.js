require("dotenv").config();
const express = require("express");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Painting = mongoose.model(process.env.PAINTING_MODEL);

function handleResponse(res, status, message) {
    if (typeof message === "object") {
        res.status(status).json(message);
        return;
    }
    res.status(status).json({ message: message });
}
function findPaintingByName(name, callback) {
    Painting.findOne({ name: name }).exec(callback);
}
function findPaintingById(id, callback) {
    Painting.findById(id).exec(callback);
}
function addPainting(req, res) {
    const paintingName = req.body.name;
    let status = 200;
    let message;

    findPaintingByName(paintingName, function (error, doc) {
        if (error) {
            status = 500;
            message = process.env.ERROR_INTERNAL;
        } else if (doc) {
            status = 409;
            message = process.env.ERROR_CONFLICT + ": Painting already exists";
        } else {
            Painting.create(req.body, function (error, doc) {
                if (error) {
                    status = 500;
                    message = process.env.ERROR_INTERNAL;
                } else {
                    status = 201;
                    message = process.env.SUCCESS_MESSAGE + ": Painting created successfully";
                }
                handleResponse(res, status, message);
            });
            return;
        }
        handleResponse(res, status, message);
    });
}

function addMuseumByPaintingId(req, res) {
    const paintingId = req.params.id;
    let status = 200;
    let message;
    findPaintingById(paintingId, function (error, doc) {
        if (error) {
            status = 500;
            message = process.env.ERROR_INTERNAL;
        } else if (!doc) {
            status = 404;
            message = "Painting not found";
        } else {
            Painting.updateOne(
                { _id: ObjectId(paintingId) },
                { $push: { museum: req.body } },
                function (error, result) {
                    if (error) {
                        status = 500;
                        message = process.env.ERROR_INTERNAL;
                    } else {
                        status = 201;
                        message = process.env.SUCCESS_MESSAGE + ": Museum added successfully";
                    }
                    handleResponse(res, status, message);
                }
            );
            return;
        }
        handleResponse(res, status, message);
    });
};

function getPaintings(req, res) {
    const offset = parseInt(req.query.offset, 10) || parseInt(process.env.OFFSET, 10);
    const count = parseInt(req.query.count, 10) || parseInt(process.env.COUNT, 10);
    let status = 200;
    let message;

    Painting.find()
        .skip(offset)
        .limit(count)
        .exec(function (error, docs) {
            if (error) {
                status = 500;
                message = process.env.ERROR_INTERNAL;
            } else if (!docs.length) {
                status = 404;
                message = process.env.ERROR_NOT_FOUND + ": No paintings found";
            } else {
                status = 200;
                message = docs;
            }
            handleResponse(res, status, message);
        });
}

function getPaintingById(req, res) {
    const paintingId = req.params.id;
    let status = 200;
    let message;

    findPaintingById(paintingId, function (error, doc) {
        if (error) {
            status = 500;
            message = process.env.ERROR_INTERNAL;
        } else if (!doc) {
            status = 404;
            message = process.env.ERROR_NOT_FOUND + ": Painting not found";
        } else {
            status = 200;
            message = doc;
        }
        handleResponse(res, status, message);
    });
}

function getPaintingByName(req, res) {
    const paintingName = req.params.name;
    let status = 200;
    let message;

    findPaintingByName(paintingName, function (error, doc) {
        if (error) {
            status = 500;
            message = process.env.ERROR_INTERNAL;
        } else if (!doc) {
            status = 404;
            message = process.env.ERROR_NOT_FOUND + ": Painting not found";
        } else {
            status = 200;
            message = doc;
        }
        handleResponse(res, status, message);
    });
}

function getMuseumByPaintingId(req, res, locationType) {
    const paintingId = req.params.id;
    let status = 200;
    let message;

    findPaintingById(paintingId, function (error, doc) {
        if (error) {
            status = 500;
            message = process.env.ERROR_INTERNAL;
        } else if (!doc || !doc.museum || !doc.museum[locationType]) {
            status = 404;
            message = locationType.replace('_', ' ') + " not found";
        } else {
            status = 200;
            message = doc.museum[locationType];
        }
        handleResponse(res, status, message);
    });
}

function getMuseumByPaintingName(req, res, locationType) {
    const paintingName = req.params.name;
    let status = 200;
    let message;

    findPaintingByName(paintingName, function (error, doc) {
        if (error) {
            status = 500;
            message = process.env.ERROR_INTERNAL;
        } else if (!doc || !doc.museum || !doc.museum[locationType]) {
            status = 404;
            message = locationType.replace('_', ' ') + " not found";
        } else {
            status = 200;
            message = doc.museum[locationType];
        }
        handleResponse(res, status, message);
    });
}

function updatePainting(req, res, query) {
    let status = 200;
    let message;

    Painting.updateOne(query, { $set: req.body }, function (error, result) {
        if (error) {
            status = 500;
            message = process.env.ERROR_INTERNAL;
        } else if (!result.matchedCount) {
            status = 404;
            message = "Painting not found";
        } else {
            status = 200;
            message = process.env.SUCCESS_MESSAGE + ": Painting updated successfully";
        }
        handleResponse(res, status, message);
    });
}
function deletePainting(req, res, query) {
    console.log("query", query);
    let status = 200;
    let message;

    Painting.deleteOne(query).exec(function (error, result) {
        if (error) {
            status = 500;
            message = process.env.ERROR_INTERNAL;
        } else if (!result.deletedCount) {
            status = 404;
            message = "Painting not found";
        } else {
            status = 200;
            message = process.env.SUCCESS_MESSAGE + ": Painting deleted successfully";
        }
        handleResponse(res, status, message);
    });
}

function deleteMuseum(req, res, query) {
    let status = 200;
    let message;

    Painting.updateOne(query, { $pull: { museum: req.body } }, function (error, result) {
        if (error) {
            status = 500;
            message = process.env.ERROR_INTERNAL;
        } else if (!result.matchedCount) {
            status = 404;
            message = "Painting not found";
        } else {
            status = 200;
            message = "Museum information removed";
        }
        handleResponse(res, status, message);
    });
}

function getCurrentMuseumByPaintingId(req, res) { 
    getMuseumByPaintingId(req, res, 'current_location'); 
}
function getFormerMuseumByPaintingId(req, res) { 
    getMuseumByPaintingId(req, res, 'first_displayed'); 
}
function getCurrentMuseumByPaintingName(req, res) { 
    getMuseumByPaintingName(req, res, 'current_location'); }
function getFormerMuseumByPaintingName(req, res) { 
    getMuseumByPaintingName(req, res, 'first_displayed'); 
}
function updatePaintingById(req, res) { 
    updatePainting(req, res, { _id: ObjectId(req.params.id) }); 
}
function updatePaintingByName(req, res) { 
    updatePainting(req, res, { name: req.params.name }); 
}
function updateMuseumByPaintingId(req, res) { 
    updatePainting(req, res, { _id: ObjectId(req.params.id) }); 
}
function deletePaintingById(req, res) { 
    deletePainting(req, res, { _id: req.params.id }); 
}
function deletePaintingByName(req, res) { 
    deletePainting(req, res, { name: req.params.name }); 
}
function deleteMuseumByPaintingId(req, res) { 
    deleteMuseum(req, res, { _id: ObjectId(req.params.id) }); 
}
function deleteMuseumByPaintingName(req, res) { 
    deleteMuseum(req, res, { name: req.params.name }); 
}

module.exports = {
    addPainting,
    getPaintings,
    getPaintingById,
    getPaintingByName,
    addMuseumByPaintingId,
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
