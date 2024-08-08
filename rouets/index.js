require("dotenv").config();
const express= require("express");
const router= express.Router();
const paintingController= require("../controllers/paintings.controller");
const userController= require("../controllers/users.controller");

// routes for paintings
router.route('/paintings')
      .post(paintingController.addPainting)
      .get(paintingController.getPaintings);
router.route('/paintings/:id/museum')
      .post(paintingController.addMuseumByPaintingId);
router.route('/paintings/:id')
      .get(paintingController.getPaintingById)
      .delete(paintingController.deletePaintingById)
      .put(paintingController.updatePaintingById);
router.route('/paintings/:name')
      .get(paintingController.getPaintingByName)
      .delete(paintingController.deletePaintingByName)
      .put(paintingController.updatePaintingByName);
router.route('/paintings/:id/museum/current')
      .get(paintingController.getCurrentMuseumByPaintingId);
router.route('/paintings/:name/museum/current')
      .get(paintingController.getCurrentMuseumByPaintingName);
router.route('/paintings/:id/museum/former')
      .get(paintingController.getFormerMuseumByPaintingId);
router.route('/paintings/:name/museum/former')
      .get(paintingController.getFormerMuseumByPaintingName);
router.route('/paintings/:id/museum')
      .put(paintingController.updateMuseumByPaintingId)
      .delete(paintingController.deleteMuseumByPaintingId);
router.route('/paintings/:name/museum')
      .delete(paintingController.deleteMuseumByPaintingName);

// routes for users
router.route('/users')
      .post(userController.addUser)
      .get(userController.getUsers);
router.route('/users/:username')
      .get(userController.getUserByName)
      .delete(userController.deleteUserByName);
// user login
router.route('/login')
      .post(userController.login);

module.exports= router;