const express = require("express");
const passport = require("passport");
const {saveRedirectURL} = require("../middlewares.js");
const userController = require("../controllers/user.js");

const router = express.Router();

router.get("/signup", userController.renderSignupForm);

router.post("/signup", userController.signupUser);

router.get("/login", userController.renderLoginForm);

router.post(
	"/login",
	saveRedirectURL,
	passport.authenticate("local", {
		failureRedirect: "/login",
		failureFlash: true,
	}),
	userController.loginUser
);

router.get("/logout", userController.logout);

module.exports = router;
