const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.renderProfile = wrapAsync(async (req, res) => {
	let currUser = await User.findById(req.user.id).populate([
		{
			path: "postedListings",
			model: "Listing",
		},
		{
			path: "savedListings",
			model: "Listing",
		},
		{
			path: "postedReviews",
			model: "Review",
		},
		{
			path: "bookings",
			model: "Booking",
		},
	]);
	console.log(currUser);
	res.render("users/profile.ejs", {user: currUser});
});
module.exports.renderSignupForm = (req, res) => {
	res.render("users/signup.ejs");
};
module.exports.renderLoginForm = (req, res) => {
	res.render("users/login.ejs");
};
module.exports.signupUser = wrapAsync(async (req, res) => {
	let {firstName, lastName, contact, username, email, password} =
		req.body.user;
	let newUser = new User({
		firstName: firstName,
		lastName: lastName,
		contact: contact,
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
	res.redirect("/listings");
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
