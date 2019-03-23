var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var paper = require("../models/paper");
var question = require("../models/question");

router.get("/", middleware.isLoggedIn, (req, res) => {
    res.render("papers/index");
})

module.exports = router;