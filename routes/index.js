var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require('../middleware/index');

router.get("/", (req, res) => {
	res.render("home");
});

router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", (req, res) => {
	var newUser = new User({
		username: req.body.username
	});
	if (req.body.password.length < 6 || req.body.password.length > 10) {
		req.flash("error", "Password must be 6-10 characters long");
		return res.redirect("/register");
	}
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function () {
			req.flash("success", "Welcome to Question Paper Generator System " + user.username);
			res.redirect("/");
		});
	});
});

router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login"
}), function (req, res) {});

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/");
})

router.get("/account", middleware.isLoggedIn, (req, res) => {
	search = {};
	search.username = req.user.username;
	User.findOne(search, (err, userInformation) => {
		if (err) {
			console.log(err);
		} else {
			console.log(userInformation);
			res.render("account", {
				user: userInformation
			});
		}
	});
});

router.post("/account", middleware.isLoggedIn, (req, res) => {
	search = {};
	search.username = req.user.username;
	User.findOneAndUpdate(search, req.body.user, (err, userInformation) => {
		if (err) {
			req.flash("error", err.message)
			res.redirect("/account");
		} else {
			req.flash("success", "Updated Account information");
			res.redirect("/");
		}
	});
});


module.exports = router;