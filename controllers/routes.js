require("dotenv").config;
const express= require("express");
const dbconncetion= require("../database-connection/dbconnection");
const { ObjectId } = require("mongodb");
const dbconnection = require("../database-connection/dbconnection");

// initialize router
const router= express.Router();

// Post
// add new painting
router.route("/paintings")
.post(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .insertOne(req.body, function(error, doc){
            if(error){
                res.send(error);
            } else {
                res.status(200).json(doc);
            }
        });
})
// add many new paintings
router.route("/paintings/batch")
.post(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .insertMany(req.body, function(error, doc){
            if(error){
                res.send(error);
            } else {
                res.status(200).json(doc);
            }
        });
})
// add new mesium for an existing painting by id
router.route("/museum/painting/:id")
.post(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .updateOne({_id: ObjectId(req.params.id)}, {$push: {museum: req.body}}, function(error, doc){
            if(error){
                res.status(404).send(error);
            } else {
                res.status(200).json(doc);
            }
        });
})
// add new meseum for an existing painting by name
router.route("/museum/painting/:name")
.post(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .updateOne({name: req.params.name}, {$push: {museum: req.body}}, function(error, doc){
            if(error){
                res.status(404).send(error);
            } else {
                res.status(200).json(doc);
            }
        });
});

// Get
// get all paintings
router.route("/paintings")
.get(function(req, res){
    const db= dbconncetion.get();
    let offset= 0;
    let count= 5;
    if(req.query && req.query.offset){
        offset= parseInt(req.query.offset);
    }
    if(req.query && req.query.count){
        count= parseInt(req.query.count);
    }
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .find()
        .skip(offset)
        .limit(count)
        .toArray(function(error, docs){
            if(error){
                res.send(error);
            } else {
                res.status(200).json(docs);
            }
        });
});
// get painting by id
router.route("/paintings/:id")
.get(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .findOne({_id: ObjectId(req.params.id)}, function(error, doc){
            if(error){
                res.status(404).send(error);
            } else {
                res.status(200).json(doc);
            }
        });
});
// get painting by name
router.route("/paintings/name/:name")
.get(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .findOne({name : req.params.name}, function(error, doc){
            if(error){
                res.status(404).send(error);
            } else {
                res.status(200).json(doc);
            }
        });
});
// get the current museum by painting id
router.route("/current-museum/painting/:id")
.get(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .findOne({_id: ObjectId(req.params.id)}, function(error, doc){
            if(error){
                res.status(404).send(error);
            } else {
                res.status(200).json(doc.museum.current_location);
            }
        });
});
// get the former-museum by painting id
router.route("/former-museum/painting/:id")
.get(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .findOne({_id: ObjectId(req.params.id)}, function(error, doc){
            if(error){
                res.status(404).send(error);
            } else {
                res.status(200).json(doc.museum.first_displayed);
            }
        });
})
// get the current museum by painting name
router.route("/current-museum/painting/name/:name")
.get(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .findOne({name : req.params.name}, function(error, doc){
            if(error){
                res.status(404).send(error);
            } else {
                res.status(200).json(doc.museum.current_location);
            }
        });
})
// get the former museum by painting name
router.route("/former-museum/painting/name/:name")
.get(function(req, res){
    const db= dbconnection.get();
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .findOne({name: req.params.name}, function(error, doc){
            if(error){
                res.status(404).send(error)
            } else {
                res.status(200).json(doc.museum.first_displayed);
            }
        });
});

// Update --> Put
// update painting by id
router.route("/paintings/:id")
.put(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .updateOne({_id: ObjectId(req.params.id)}, {$set: req.body}, function(error, doc){
            if(error){
                res.status(404).send(error);
            } else {
                res.status(200).json(doc);
            }
        });
})
// update painting by name
router.route("/painting/:name")
.put(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .updateOne({name: req.params.name}, {$set: req.body}, function(error, doc){
            if(error){
                res.status(404).send(error);
            } else {
                res.status(200).json(doc);
            }
        });
});

// partial update for an existing painting
router.route("/museum/painting/:id")

// Delete
// delete painting by id
router.route("/paintings/:id")
.delete(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .deleteOne({_id: req.params.id}, function(error, doc){
            if(error){
                res.status(404).send(error);
            } else {
                res.status(200).json(doc);
            }
        })
})
// delete painting by name
router.route("/painting/:name")
.delete(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .deleteOne({name: req.params.name}, function(error, doc){
            if(error){
                res.status(404).send(error);
            } else {
                res.status(200).json(doc);
            }
        })
})
// delete museum by painting id
router.route("/museum/painting/:id")
.delete(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .deleteOne({_id: req.params.id}, {$pop: {museum: req.body}}, function(error, doc){
            if(error){
                res.status(404).send(error);
            } else {
                res.status(200).json(doc);
            }
        })
})

// delete museum by painting name
router.route("/museum/painting/:name")

module.exports= router;