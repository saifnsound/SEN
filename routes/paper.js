var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var paper = require("../models/paper");
var question = require("../models/question");

router.get("/", middleware.isLoggedIn, (req, res) => {
    res.render("papers/index");
})

router.get("/generate", middleware.isLoggedIn, (req, res) => {
    res.render("papers/generate");
})

router.post("/generate", middleware.isLoggedIn, (req, res) => {
    var newPaper = {
        format: req.body.format,
        subject: req.body.subject,
        topic: req.body.topic,
        numberOfQuestions: req.body.numberOfQuestions,
        name: req.body.name,
        time: req.body.time,
        difficulty: req.body.difficulty,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }
    //logic to get the questions from question library.
});
module.exports = router;