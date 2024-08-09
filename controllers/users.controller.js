require("dotenv").config();
const express = require("express");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const User= mongoose.model(process.env.USER_MODEL);
const bcrypt= require("bcryptjs");
const jwt= require("jsonwebtoken");

const SECRET_KEY= process.env.SECRET_KEY;


//  when we add user password should be encrypted and stored in the db
// we use bcrypt for this purpose
const addUser= function(req, res) {
    const user = req.body;
    User.findOne({username: user.username}).exec(function(error, doc) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
        if (doc) {
            return res.status(409).json({ error: "Username already taken" });
        }
        // encrypt user password and add salt
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return res.status(500).json({ error: err.message || "Internal server error" });
            }
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    return res.status(500).json({ error: err.message || "Internal server error" });
                }
                user.password = hash;
                User.create(user, function(error, doc) {
                    if (error) {
                        return res.status(500).json({ error: error.message || "Internal server error" });
                    }
                    console.log("User created successfully");
                    return res.status(201).json(doc);
                });
            });
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
// const login = function(req, res) {
//     console.log("here", req.body);
//     const { username, password } = req.body;

//     // Find the user by username
//     User.findOne({ username }).exec(function(error, existingUser) {
//         if (error) {
//             return res.status(500).json({ error: error.message || "Internal server error" });
//         }   
//         if (!existingUser) {
//             return res.status(404).json({ error: "User not found" });
//         }   

//         // Compare the provided password with the stored hashed password
//         bcrypt.compare(password, existingUser.password, function(err, isMatch) {
//             if (err) {
//                 return res.status(500).json({ error: "Error during password comparison" });
//             }

//             if (!isMatch) {
//                 return res.status(401).json({ error: "Invalid credentials" });
//             }

//             console.log("User logged in successfully");
//             return res.status(200).json({ message: "Login successful", user: existingUser });
//         });
//     });
// };
const login = function(req, res) {
    console.log("here", req.body);
    const { username, password } = req.body;

    // Find the user by username
    User.findOne({ username }).exec(function(error, existingUser) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }   
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }   

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, existingUser.password, function(err, isMatch) {
            if (err) {
                return res.status(500).json({ error: "Error during password comparison" });
            }

            if (!isMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Generate a JWT token
            const token = jwt.sign(
                { userId: existingUser.password, username: existingUser.username }, 
                SECRET_KEY,
                { expiresIn: process.env.TOKEN_EXPIRATION_TIME } // Token expiration time
            );

            console.log("User logged in successfully");
            return res.status(200).json({ message: "Login successful", token: token, user: existingUser });
        });
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
