require("dotenv").config();
const express = require("express");
const router = express.Router();
const paintingController = require("../controllers/paintings.controller");
const userController = require("../controllers/users.controller");

const verifyToken = require("../api/security/verifyToken");

// Routes for paintings
router.route('/paintings')
    .post(verifyToken, paintingController.addPainting)
    .get(paintingController.getPaintings);

router.route('/paintings/id/:id/museum')
    .post(verifyToken, paintingController.addMuseumByPaintingId);

router.route('/paintings/id/:id')
    .get(paintingController.getPaintingById)
    .delete(verifyToken, paintingController.deletePaintingById)
    .put(verifyToken, paintingController.updatePaintingById);

router.route('/paintings/name/:name')
    .get(paintingController.getPaintingByName)
    .delete(verifyToken, paintingController.deletePaintingByName)
    .put(verifyToken, paintingController.updatePaintingByName);

router.route('/paintings/id/:id/museum/current')
    .get(paintingController.getCurrentMuseumByPaintingId);

router.route('/paintings/name/:name/museum/current')
    .get(paintingController.getCurrentMuseumByPaintingName);

router.route('/paintings/id/:id/museum/former')
    .get(paintingController.getFormerMuseumByPaintingId);

router.route('/paintings/name/:name/museum/former')
    .get(paintingController.getFormerMuseumByPaintingName);

router.route('/paintings/id/:id/museum')
    .put(verifyToken, paintingController.updateMuseumByPaintingId)
    .delete(verifyToken, paintingController.deleteMuseumByPaintingId);

router.route('/paintings/name/:name/museum')
    .delete(verifyToken, paintingController.deleteMuseumByPaintingName);

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
