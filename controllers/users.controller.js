require("dotenv").config();
const express = require("express");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const User= mongoose.model(process.env.USER_MODEL);

const addUser= function(req, res) {
    const username= req.body.username;
    User.findOne({username: username}).exec(function(error, doc) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
        if (doc) {
            return res.status(409).json({ error: "User already exists" });
        }
        // insert new user
        User.create(req.body, function(error, doc) {
            if (error) {
                return res.status(500).json({ error: error.message || "Internal server error" });
            }
            console.log("User created successfully");
            return res.status(201).json(doc);
        });
    });
};

const getUsers= function(req, res) {
    User
        .find()
        .exec(function(error, docs) {
            if (error) {
                return res.status(500).json({ error: error.message || "Internal server error" });
            }
            return res.status(200).json(docs);
        });
};

const getUserByName= function(req, res) {
    const username= req.params.username;
    User
        .findOne({username: username})
        .exec(function(error, doc) {
            if (error) {
                return res.status(500).json({ error: error.message || "Internal server error" });
            }
            if (!doc) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json(doc);
        });
};
// update user
const updateUserByUsername= function(req, res) {
    const username= req.params.username;
    User
        .updateOne({username: username}, req.body)
        .exec(function(error, doc) {
            if (error) {
                return res.status(500).json({ error: error.message || "Internal server error" });
            }
            if (!doc) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json(doc);
        });
};
// delete user
const deleteUserByName= function(req, res) {
    const username= req.params.username;
    User
        .deleteOne({username: username})
        .exec(function(error, doc) {
            if (error) {
                return res.status(500).json({ error: error.message || "Internal server error" });
            }
            if (!doc) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json(doc);
        });
};
// user login
const login= function(req, res) {
    console.log("here", req.body);
    const username= req.body.username;
    const password= req.body.password;
    User
        .findOne({username: username}).exec(function(error, user) {
            if (error) {
                return res.status(500).json({ error: error.message || "Internal server error" });
            }   
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }   
            if (user.password !== password) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            console.log("User logged in successfully");
            return res.status(200).json(user);
        });
};
module.exports= {
    addUser: addUser,
    getUsers: getUsers,
    getUserByName: getUserByName,
    updateUserByUsername: updateUserByUsername,
    deleteUserByName: deleteUserByName,
    login: login
};
