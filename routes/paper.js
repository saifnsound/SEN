var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var paper = require("../models/paper");
var question = require("../models/question");
var paperController = require("../controllers/paper");
const PDFDocument = require('pdfkit');

router.get("/", middleware.isLoggedIn, (req, res) => {
    paper.find({
        "author.username": "" + req.user.username + ""
    }, (err, allPapers) => {
        if (err) {
            console.log(err);
        } else {
            res.render("papers/index", {
                papers: allPapers
            });
        }
    });
});

router.get("/generate", middleware.isLoggedIn, (req, res) => {
    res.render("papers/generate");
});

router.post("/generate", middleware.isLoggedIn, (req, res) => {
    var newPaper = {
        format: req.body.format,
        subject: req.body.subject,
        topic: req.body.topic,
        name: req.body.name,
        time: req.body.time,
        difficulty: req.body.difficulty,
        author: {
            id: req.user._id,
            username: req.user.username
        },
        questions: []
    }
    console.log(newPaper.format);
    question.find({
        "author.username": "" + req.user.username + ""
    }, (err, allQuestions) => {
        if (err) {
            console.log(err);
        } else {
            var topics = newPaper.topic.split("/");
            newPaper.questions = paperController.generateQuestions(allQuestions, newPaper, topics);
            if (newPaper.questions == -1) {
                req.flash("error", "Questions in the library are insufficient. Please add more questions");
                return res.redirect("/questions");
            } else {
                paper.create(newPaper, (err, newlyCreated) => {
                    if (err) {
                        req.flash("error", err.message)
                        res.redirect("/papers");
                    } else {
                        req.flash("success", "Added question paper to your library");
                        res.redirect("/papers");
                    }
                });
            }
        }
    });
});

router.get("/:id/download", middleware.isLoggedIn, (req, res) => {
    paper.findById(req.params.id, async (err, foundPaper) => {
        var questions = [];
        for (let i = 0; i < foundPaper.questions.length; i++) {
            await question.findById(foundPaper.questions[i], (err, question) => {
                questions.push(question);
            })
        }
        const doc = new PDFDocument;
        doc.pipe(res);
        doc.fontSize(25)
            .text(foundPaper.name, {
                align: 'center'
            });
        doc.fontSize(12);
        doc.moveDown();
        doc.text(`Subject: ${foundPaper.subject}`);
        doc.moveDown();
        doc.text(`Topic: ${foundPaper.topic}`);
        for (let i = 0; i < questions.length; i++) {
            doc.moveDown();
            doc.text(`${i+1}. ${questions[i].question.replace(/\r\n|\r/g, '\n')}`);
        }
        doc.end();
    });
})

router.get("/:id/solution", middleware.isLoggedIn, (req, res) => {
    paper.findById(req.params.id, async (err, foundPaper) => {
        var questions = [];
        for (let i = 0; i < foundPaper.questions.length; i++) {
            await question.findById(foundPaper.questions[i], (err, question) => {
                questions.push(question);
            })
        }
        const doc = new PDFDocument;
        doc.pipe(res);
        doc.fontSize(25)
            .text(foundPaper.name, {
                align: 'center'
            });
        doc.fontSize(12);
        doc.moveDown();
        doc.text(`Subject: ${foundPaper.subject}`);
        doc.moveDown();
        doc.text(`Topic: ${foundPaper.topic}`);
        for (let i = 0; i < questions.length; i++) {
            doc.moveDown();
            doc.text(`${i+1}. ${questions[i].question.replace(/\r\n|\r/g, '\n')}`);
            doc.moveDown();
            doc.text(`Sol. ${questions[i].solution.replace(/\r\n|\r/g, '\n')}`);
        }
        doc.end();
    });
})

router.get("/:id", middleware.isLoggedIn, (req, res) => {
    paper.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash("error", err.message)
            res.redirect("/papers");
        } else {
            req.flash("success", "Deleted Paper");
            res.redirect("/papers");
        }
    });
});

router.post("/search", middleware.isLoggedIn, (req, res) => {
    var search = {
        "author.username": "" + req.user.username + ""
    }
    if (req.body.format != undefined) {
        search.format = req.body.format;
    }
    if (req.body.name != '') {
        search.name = req.body.name;
    }
    if (req.body.subject != '') {
        search.subject = req.body.subject;
    }
    if (req.body.topic != '') {
        search.topic = req.body.topic;
    }
    if (req.body.difficulty != '') {
        search.difficulty = req.body.difficulty;
    }
    console.log(search);
    paper.find(search, (err, allPapers) => {
        if (err) {
            console.log(err);
        } else {
            res.render("papers/search", {
                papers: allPapers
            });
        }
    })
})
module.exports = router;