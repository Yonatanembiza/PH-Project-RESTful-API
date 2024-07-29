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
    if(!req.body || typeof req.body !== 'object'){
        return res.status(400).json({error: "invalid data"})
    }
    // check if painting already exists
    paintingCollection
        .findOne({name: req.body.name}, function(error, doc){
            if(error){
                return res.status(500).json({error: error.message || "internal server error"})
            }
            if(doc){
                return res.status(409).json({error: "painting already exists"})
            }
        });

    if(!paintingCollection){
        return res.status(500).json({error: "internal server error"})
    }
    paintingCollection
        .insertOne(req.body, function(error, doc){
            if(error){
                return res.status(500).json({error: error.message || "Internal server error"})
            }
            res.status(201).json(doc);
        });
})
// add many new paintings
router.route("/paintings/batch")
.post(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    if(!Array.isArray(req.body)){
        return res.status(400).json({error: "invalid data"})
    }
    paintingCollection
        .insertMany(req.body, function(error, doc){
            if(error){
                return res.status(500).json({error: error.message || "Internal server error"})
            } 
            res.status(201).json(doc);
        });
})
// add new meseum for an existing painting by id
router.route("/museum/painting/:id")
.post(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    if(!ObjectId.isValid(req.params.is) || !req.body){
        return res.status(400).json({error: "invalid ID or data"})
    }
    paintingCollection
        .updateOne({_id: ObjectId(req.params.id)}, {$push: {museum: req.body}}, function(error, doc){
            if(error){
                return res.status(500).json({error: error.message || "Internal server error"})
            } 
            res.status(200).json(doc);
        });
})
// add new meseum for an existing painting by name
router.route("/museum/painting/name/:name")
.post(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    if(!req.body){
        res.status(400).json({error: "invalid data"})
    }
    paintingCollection
        .updateOne({name: req.params.name}, {$push: {museum: req.body}}, function(error, doc){
            if(error){
                return res.status(500).json({error: error.message || "internal server error"})
            } 
            res.status(200).json(doc);
        });
});

// Get
// get all paintings
router.route("/paintings")
.get(function(req, res){
    const db= dbconncetion.get();
    let offset= parseInt(req.query.offset) || 0;
    let count= parseInt(req.query.count) || 5;
    
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .find()
        .skip(offset)
        .limit(count)
        .toArray(function(error, docs){
            if(error){
                return res.status(500).json({error: error.message || "Internal server error"})
            } 
            res.status(200).json(docs);
        });
});

// get painting by id
router.route("/paintings/:id")
.get(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    if(!ObjectId.isValid(req.params.id)){
        return res.status(400).json({error: "invalid ID"});
    }
    paintingCollection
        .findOne({_id: ObjectId(req.params.id)}, function(error, doc){
            if(error){
                return res.status(500).json({error: error.message || "internal error"});
            } 
            res.status(200).json(doc);
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
                return res.status(500).json({error: error.message || "internal error"})
            } 
            if(!doc) {
                return res.status(404).json({error: "painting not found"});
            }
        });
});
// get the current museum by painting id
router.route("/current-museum/painting/:id")
.get(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    if(!ObjectId.isValid(req.params.id)){
        return res.status(400).json({error: "invalid ID"});
    }
    paintingCollection
        .findOne({_id: ObjectId(req.params.id)}, function(error, doc){
            if(error){
                return res.status(500).json({error: "internal error"});
            } 
            if(!doc || !doc.museum || !doc.museum.current_location){
                return res.status(404).json({error: " not found"});
            }
            res.status(200).json(doc.museum.current_location);
        });
});
// get the former-museum by painting id
router.route("/former-museum/painting/:id")
.get(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    if(!ObjectId.isValid(req.params.id)){
        return res.status(400).json({error: "invalid ID"});
    }
    paintingCollection
        .findOne({_id: ObjectId(req.params.id)}, function(error, doc){
            if(error){
                return res.status(500).json({error: "internal error"});
            } 
            if(!doc || !doc.museum || !doc.museum.first_displayed){
                return res.status(404).json({error: " not found"});
            }            
            res.status(200).json(doc.museum.first_displayed);
            
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
                return res.status(500).json({error: "internal error"})
            } 
            if(!doc || !doc.museum || !doc.museum.current_location){
                return res.status(404).json({error: "not found"})
            }
            res.status(200).json(doc.museum.current_location);
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
                return res.status(500).json({error: "internal error"})
            } 
            if(!doc || !doc.museum || !doc.museum.first_displayed){
                return res.status(404).json({error: "not found"})
            }
            res.status(200).json(doc.museum.first_displayed);
        });
});

// Update --> Put
// update painting by id
router.route("/paintings/:id")
.put(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    if(!ObjectId.isValid(req.params.id) || !req.body || typeof req.body !== 'object'){
        return res.status(400).json({error: "invalid data"});        
    }
    paintingCollection
        .updateOne({_id: ObjectId(req.params.id)}, {$set: req.body}, function(error, doc){
            if(error){
                return res.status(500).json({error: "internal error"})
            } 
            if(!doc){
                return res.status(404).json({error: "painting not found"});
            }
            res.status(200).json(doc);
        });
})
// update painting by name
router.route("/painting/:name")
.put(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    if(!req.body || typeof req.body !== 'object'){
        return res.status(400).json({error: "invalid data"})
    }
    paintingCollection
        .updateOne({name: req.params.name}, {$set: req.body}, function(error, doc){
            if(error){
                return res.status(500).json({error: "internal error"})
            } 
            if(!doc){
                return res.status(404).json({error: "painting not found"});
            }
            res.status(200).json(doc);
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
    if(!ObjectId.isValid(req.params.id)){
        return res.status(400).json({error: "invalid ID"});
    }
    paintingCollection
        .deleteOne({_id: req.params.id}, function(error, doc){
            if(error){
                return res.status(500).json({error: "internal error"})
            } 
            if(!doc){
                return res.status(404).json({error: "painting not found"});
            }
            res.status(200).json(doc);
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
                return res.status(500).json({error: error.message || "internal error"});
            } 
            if(!doc){
                return res.status(404).json({error: "painting not found"});
            }
            res.status(200).json(doc);
        });
});
// delete museum by painting id
router.route("/museum/painting/:id")
.delete(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");

    if(!ObjectId.isValid(req.params.id)){
        return res.status(400).json({error: "invalid ID"});
    }
    paintingCollection
        .deleteOne({_id: req.params.id}, {$pop: {museum: req.body}}, function(error, doc){
            if(error){
                return res.status(500).json({error: error.message || "internal error"});
            } 
            if(!doc){
                return res.status(404).json({error: "painting not found"});
            }
            res.status(200).json(doc);
        })
})

// delete museum by painting name
router.route("/museum/painting/:name")
.delete(function(req, res){
    const db= dbconncetion.get();
    const paintingCollection= db.collection("paintings");
    paintingCollection
        .deleteOne({name: req.params.name}, {$pop: {museum: req.body}}, function(error, doc){
            if(error){
                return res.status(500).json({error: error.message || "internal error"});
            } 
            if(!doc){
                return res.status(404).json({error: "painting not found"});
            }
            res.status(200).json(doc);
        });
});

// exporting the module

module.exports= router;