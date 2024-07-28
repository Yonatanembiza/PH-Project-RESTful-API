require("dotenv").config;
const express= require("express");

const router= express.Router();
// all paintings
router.route("/paintings")
// painting by id
router.route("/paintings/:id")
// musiume by painting id
router.route("/current-musiume/painting/:id")
// former-musium by painting id
router.route("/former-musiume/painting/:id");
// current musium by painting name
router.route("/musium/painting/:name");
// former musium by painting name
router.route("/former-musium/painting/:name");