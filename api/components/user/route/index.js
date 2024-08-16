require("dotenv").config();
const express = require("express");
const router = express.Router();
const userController = require("../controller/users.controller");

const verifyToken = require("../../../security/verifyToken");

// Routes for users
router.route('/users')
    .post(userController.addUser)
    .get(verifyToken, userController.getUsers);

router.route('/users/username/:username')
    .get(verifyToken, userController.getUserByName)
    .delete(verifyToken, userController.deleteUserByName)
    .put(verifyToken, userController.updateUserByUsername);

router.route('/users/login')
    .post(userController.login);

module.exports = router;
