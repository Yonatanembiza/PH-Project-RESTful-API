require("dotenv").config();
const express = require("express");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const User = mongoose.model(process.env.USER_MODEL);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

// Add a new user with encrypted password
const addUser = function (req, res) {
    const user = req.body;

    User.findOne({ username: user.username }).exec(function (error, existingUser) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
        if (existingUser) {
            return res.status(409).json({ error: "Username already taken" });
        }

        // Encrypt user password and add salt
        bcrypt.genSalt(10, function (error, salt) {
            if (error) {
                return res.status(500).json({ error: error.message || "Internal server error" });
            }
            bcrypt.hash(user.password, salt, function (error, hash) {
                if (error) {
                    return res.status(500).json({ error: error.message || "Internal server error" });
                }
                user.password = hash;
                User.create(user, function (error, newUser) {
                    if (error) {
                        return res.status(500).json({ error: error.message || "Internal server error" });
                    }
                    return res.status(201).json(newUser);
                });
            });
        });
    });
};

// Get all users
const getUsers = function (req, res) {
    User.find().exec(function (error, users) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
        return res.status(200).json(users);
    });
};

// Get a user by username
const getUserByName = function (req, res) {
    const username = req.params.username;
    User.findOne({ username }).exec(function (error, user) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
    });
};

// Update user by username
const updateUserByUsername = function (req, res) {
    const username = req.params.username;
    User.updateOne({ username }, req.body).exec(function (error, result) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(result);
    });
};

// Delete user by username
const deleteUserByName = function (req, res) {
    const username = req.params.username;
    User.deleteOne({ username }).exec(function (error, result) {
        if (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(result);
    });
};

// User login and JWT generation
// const login = function (req, res) {
//     const { username, password } = req.body;

//     User.findOne({ username }).exec(function (error, existingUser) {
//         if (error) {
//             return res.status(500).json({ error: error.message || "Internal server error" });
//         }
//         if (!existingUser) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         bcrypt.compare(password, existingUser.password, function (error, isMatch) {
//             if (error) {
//                 return res.status(500).json({ error: "Unauthorized" });
//             }
//             if (!isMatch) {
//                 return res.status(401).json({ error: "Unauthorized" });
//             }

//             const token = jwt.sign(
//                 { userId: existingUser._id, username: existingUser.username },
//                 SECRET_KEY,
//                 { expiresIn: process.env.TOKEN_EXPIRATION_TIME } // Token expiration time
//             );

//             return res.status(200).json({ message: "Login successful", token, user: existingUser });
//         });
//     });
// };
// Promisified function for User.findOne
const findUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
      User.findOne({ username }).exec((error, user) => {
        if (error) {
          return reject(error);
        }
        resolve(user);
      });
    });
  };
  
  // Promisified function for bcrypt.compare
  const comparePasswords = (password, hashedPassword) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hashedPassword, (error, isMatch) => {
        if (error) {
          return reject(error);
        }
        resolve(isMatch);
      });
    });
  };
  
  // Login function using the promisified functions
  const login = (req, res) => {
    const { username, password } = req.body;
  
    findUserByUsername(username)
      .then(existingUser => {
        if (!existingUser) {
          return res.status(404).json({ error: "User not found" });
        }
  
        return comparePasswords(password, existingUser.password)
          .then(isMatch => {
            if (!isMatch) {
              return res.status(401).json({ error: "Unauthorized" });
            }
  
            const token = jwt.sign(
              { userId: existingUser._id, username: existingUser.username },
              SECRET_KEY,
              { expiresIn: process.env.TOKEN_EXPIRATION_TIME } // Token expiration time
            );
  
            return res.status(200).json({ message: "Login successful", token, user: existingUser });
          });
      })
      .catch(error => {
        return res.status(500).json({ error: error.message || "Internal server error" });
      });
  };

module.exports = {
    addUser,
    getUsers,
    getUserByName,
    updateUserByUsername,
    deleteUserByName,
    login
};
