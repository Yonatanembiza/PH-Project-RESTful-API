
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = mongoose.model(process.env.USER_MODEL);

const SECRET_KEY = process.env.SECRET_KEY;

function handleResponse(res, status, message) {
    res.status(status).json(message);
}

function findUserByUsername(username) {
    return User.findOne({ username: username }).exec();
}

function hashPassword(password) {
    return new Promise(function (resolve, reject) {
        bcrypt.genSalt(10, function (error, salt) {
            if (error) {
                reject(error);
                return;
            }
            bcrypt.hash(password, salt, function (error, hash) {
                if (error) {
                    reject(error);
                } else {
                    resolve(hash);
                }
            });
        });
    });
}

function comparePassword(password, hash) {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(password, hash, function (error, isMatch) {
            if (error) {
                reject(error);
            } else {
                resolve(isMatch);
            }
        });
    });
}

function generateLoginToken(user) {
    return jwt.sign({
        userId: user._id,
        username: user.username
    }, SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRATION_TIME
    });
}

function handleErrorResponse(error) {
    let status = 500;
    let message = { error: process.env.ERROR_INTERNAL };

    if (error.status) {
        status = error.status;
        message = error.message;
    }

    return { status, message };
}

function checkUsernameConflict(existingUser) {
    if (existingUser) {
        return {
            status: 409,
            message: { error: process.env.ERROR_CONFLICT + ": Username already taken" }
        };
    }
    return null;
}

function prepareUserForCreation(req, hash) {
    req.body.password = hash;
    return User.create(req.body);
}

function createSuccessResponse() {
    return {
        status: 201,
        message: process.env.SUCCESS_MESSAGE + ": User created successfully"
    };
}

function processLogin(existingUser, password) {
    return comparePassword(password, existingUser.password)
        .then(function (isMatch) {
            if (!isMatch) {
                return {
                    status: 401,
                    message: { error: process.env.ERROR_UNAUTHORIZED }
                };
            }
            const token = generateLoginToken(existingUser);
            return {
                status: 200,
                message: {
                    message: process.env.SUCCESS_MESSAGE + ": Login successful",
                    token: token,
                    user: {
                        firstName: existingUser.firstName,
                        lastName: existingUser.lastName
                    }
                }
            };
        });
}

function addUser(req, res) {
    const username = req.body.username;

    findUserByUsername(username)
        .then(function (existingUser) {
            const conflictResponse = checkUsernameConflict(existingUser);
            if (conflictResponse) {
                handleResponse(res, conflictResponse.status, conflictResponse.message);
                return;
            }
            return hashPassword(req.body.password);
        })
        .then(function (hash) { return prepareUserForCreation(req, hash);})
        .then(function () { handleResponse(res, createSuccessResponse().status, createSuccessResponse().message); })
        .catch(function (error) { const { status, message } = handleErrorResponse(error); handleResponse(res, status, message); });
}

function login(req, res) {
    const { username, password } = req.body;

    findUserByUsername(username)
        .then(function (existingUser) {
            if (!existingUser) {
                return {
                    status: 404,
                    message: { error: process.env.ERROR_NOT_FOUND + ": User not found" }
                };
            }
            return processLogin(existingUser, password);
        })
        .then(function (response) { handleResponse(res, response.status, response.message); })
        .catch(function (error) { const { status, message } = handleErrorResponse(error); handleResponse(res, status, message); });
}

function getUsers(req, res) {
    User.find().exec(function (error, users) {
        let status = 200;
        let message = users;

        if (error) {
            status = 500;
            message = { error: process.env.ERROR_INTERNAL };
        }
        handleResponse(res, status, message);
    });
}

function getUserByName(req, res) {
    const username = req.params.username;

    findUserByUsername(username)
        .then(function (user) {
            if (!user) {
                handleResponse(res, 404, { error: process.env.ERROR_NOT_FOUND + ": User not found" });
            } else {
                handleResponse(res, 200, user);
            }
        })
        .catch(function (error) {
            handleResponse(res, 500, { error: process.env.ERROR_INTERNAL });
        });
}

function updateUser(req, res, query) {
    User.updateOne(query, req.body).exec(function (error, result) {
        let status = 200;
        let message = process.env.SUCCESS_MESSAGE + ": User updated successfully";

        if (error) {
            status = 500;
            message = { error: process.env.ERROR_INTERNAL };
        } else if (result.matchedCount === 0) {
            status = 404;
            message = { error: process.env.ERROR_NOT_FOUND + ": User not found" };
        }
        handleResponse(res, status, message);
    });
}

function deleteUser(req, res, query) {
    User.deleteOne(query).exec(function (error, result) {
        let status = 200;
        let message = process.env.SUCCESS_MESSAGE + ": User deleted successfully";

        if (error) {
            status = 500;
            message = { error: process.env.ERROR_INTERNAL };
        } else if (result.deletedCount === 0) {
            status = 404;
            message = { error: process.env.ERROR_NOT_FOUND + ": User not found" };
        }
        handleResponse(res, status, message);
    });
}

function updateUserByUsername(req, res) {
    updateUser(req, res, { username: req.params.username });
}

function deleteUserByName(req, res) {
    deleteUser(req, res, { username: req.params.username });
}

module.exports = {
    addUser,
    getUsers,
    getUserByName,
    updateUserByUsername,
    deleteUserByName,
    login
};
