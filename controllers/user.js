const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.renderSignupForm = (req, res) => {
	res.render("users/signup.ejs");
};
module.exports.renderLoginForm = (req, res) => {
	res.render("users/login.ejs");
};
module.exports.signupUser = wrapAsync(async (req, res) => {
	let {username, email, password} = req.body.user;
	let newUser = new User({
		email: email,
		username: username,
	});

	let user = await User.register(newUser, password);
	req.login(user, function (err) {
		if (err) {
			return next(err);
		}
		req.flash("success", "Signed Up");
		res.redirect("/listings");
	});
});

module.exports.loginUser = wrapAsync(async (req, res) => {
	req.flash("success", `Welcome back!! ${req.body.username}`);
	res.redirect(res.locals.redirectURL);
});

module.exports.logout = (req, res, next) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		req.flash("success", "Logged Out!");
		res.redirect("/listings");
	});
};
