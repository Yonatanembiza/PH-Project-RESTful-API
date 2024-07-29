require("dotenv").config();
const express = require("express");
const { ObjectId } = require("mongodb");
const dbconnection = require("../database-connection/dbconnection");

// initialize router
const router = express.Router();

// Middleware to check for valid ObjectId
function checkObjectId(req, res, next) {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }
    next();
}

// Middleware to check for valid request body
function checkRequestBody(req, res, next) {
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: "Invalid data" });
    }
    next();
}

// Post
// add new painting
router.route("/paintings")
.post(checkRequestBody, function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    
    paintingCollection.findOne({ name: req.body.name }, function(error, doc) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
        if (doc) {
            return res.status(409).json({ error: "Painting already exists" });
        }
        paintingCollection.insertOne(req.body, function(error, doc) {
            if (error) {
                return res.status(500).json({ error: error.message || "Internal server error" });
            }
            res.status(201).json(doc);
        });
    });
});

// add many new paintings
router.route("/paintings/batch")
.post(checkRequestBody, function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    if (!Array.isArray(req.body)) {
        return res.status(400).json({ error: "Invalid data" });
    }
    paintingCollection.insertMany(req.body, function(error, doc) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
        res.status(201).json(doc);
    });
});

// add new museum for an existing painting by id
router.route("/museum/painting/:id")
.post(checkObjectId, checkRequestBody, function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    
    paintingCollection.updateOne(
        { _id: ObjectId(req.params.id) },
        { $push: { museum: req.body } },
        function(error, doc) {
            if (error) {
                return res.status(500).json({ error: error.message || "Internal server error" });
            }
            res.status(200).json(doc);
        }
    );
});

// add new museum for an existing painting by name
router.route("/museum/painting/name/:name")
.post(checkRequestBody, function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    
    paintingCollection.updateOne(
        { name: req.params.name },
        { $push: { museum: req.body } },
        function(error, doc) {
            if (error) {
                return res.status(500).json({ error: error.message || "Internal server error" });
            }
            res.status(200).json(doc);
        }
    );
});

// Get
// get all paintings
router.route("/paintings")
.get(function(req, res) {
    const db = dbconnection.get();
    let offset = parseInt(req.query.offset) || 0;
    let count = parseInt(req.query.count) || 5;
    
    const paintingCollection = db.collection("paintings");
    paintingCollection
        .find()
        .skip(offset)
        .limit(count)
        .toArray(function(error, docs) {
            if (error) {
                return res.status(500).json({ error: error.message || "Internal server error" });
            }
            res.status(200).json(docs);
        });
});

// get painting by id
router.route("/paintings/:id")
.get(checkObjectId, function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    
    paintingCollection.findOne({ _id: ObjectId(req.params.id) }, function(error, doc) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal error" });
        }
        if (!doc) {
            return res.status(404).json({ error: "Painting not found" });
        }
        res.status(200).json(doc);
    });
});

// get painting by name
router.route("/paintings/name/:name")
.get(function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    
    paintingCollection.findOne({ name: req.params.name }, function(error, doc) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal error" });
        }
        if (!doc) {
            return res.status(404).json({ error: "Painting not found" });
        }
        res.status(200).json(doc);
    });
});

// get the current museum by painting id
router.route("/current-museum/painting/:id")
.get(checkObjectId, function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    
    paintingCollection.findOne({ _id: ObjectId(req.params.id) }, function(error, doc) {
        if (error) {
            return res.status(500).json({ error: "Internal error" });
        }
        if (!doc || !doc.museum || !doc.museum.current_location) {
            return res.status(404).json({ error: "Not found" });
        }
        res.status(200).json(doc.museum.current_location);
    });
});

// get the former-museum by painting id
router.route("/former-museum/painting/:id")
.get(checkObjectId, function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    
    paintingCollection.findOne({ _id: ObjectId(req.params.id) }, function(error, doc) {
        if (error) {
            return res.status(500).json({ error: "Internal error" });
        }
        if (!doc || !doc.museum || !doc.museum.first_displayed) {
            return res.status(404).json({ error: "Not found" });
        }
        res.status(200).json(doc.museum.first_displayed);
    });
});

// get the current museum by painting name
router.route("/current-museum/painting/name/:name")
.get(function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    
    paintingCollection.findOne({ name: req.params.name }, function(error, doc) {
        if (error) {
            return res.status(500).json({ error: "Internal error" });
        }
        if (!doc || !doc.museum || !doc.museum.current_location) {
            return res.status(404).json({ error: "Not found" });
        }
        res.status(200).json(doc.museum.current_location);
    });
});

// get the former museum by painting name
router.route("/former-museum/painting/name/:name")
.get(function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    
    paintingCollection.findOne({ name: req.params.name }, function(error, doc) {
        if (error) {
            return res.status(500).json({ error: "Internal error" });
        }
        if (!doc || !doc.museum || !doc.museum.first_displayed) {
            return res.status(404).json({ error: "Not found" });
        }
        res.status(200).json(doc.museum.first_displayed);
    });
});

// Update --> Put
// update painting by id
router.route("/paintings/:id")
.put(checkObjectId, checkRequestBody, function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    
    paintingCollection.updateOne(
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
});

// update painting by name
router.route("/painting/:name")
.put(checkRequestBody, function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    
    paintingCollection.updateOne(
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
});

// Partial update for an existing painting (example for museum array)
// This part was incomplete in your code, I am adding a sample route
router.route("/painting/museum/:id")
.patch(checkObjectId, checkRequestBody, function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    
    paintingCollection.updateOne(
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
});

// Delete
// delete painting by id
router.route("/paintings/:id")
.delete(checkObjectId, function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    
    paintingCollection.deleteOne({ _id: ObjectId(req.params.id) }, function(error, doc) {
        if (error) {
            return res.status(500).json({ error: "Internal error" });
        }
        if (!doc.deletedCount) {
            return res.status(404).json({ error: "Painting not found" });
        }
        res.status(200).json(doc);
    });
});

// delete painting by name
router.route("/painting/:name")
.delete(function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    
    paintingCollection.deleteOne({ name: req.params.name }, function(error, doc) {
        if (error) {
            return res.status(500).json({ error: "Internal error" });
        }
        if (!doc.deletedCount) {
            return res.status(404).json({ error: "Painting not found" });
        }
        res.status(200).json(doc);
    });
});

// delete museum by painting id
router.route("/museum/painting/:id")
.delete(checkObjectId, function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    
    paintingCollection.updateOne(
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
});

// delete museum by painting name
router.route("/museum/painting/name/:name")
.delete(function(req, res) {
    const db = dbconnection.get();
    const paintingCollection = db.collection("paintings");
    
    paintingCollection.updateOne(
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
});

// exporting the module
module.exports = router;
