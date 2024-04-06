const {listingSchema, reviewSchema} = require("./schema.js");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const filters = require("./utils/filters.js");

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.redirectURL = req.originalUrl;
		req.flash("error", "You must be logged in to do that!!");
		res.redirect("/login");
	} else {
		next();
	}
};

module.exports.isOwner = async (req, res, next) => {
	let id = req.params.id;
	let result = await Listing.findById(id);
	if (result) {
		if (result.owner == req.user.id) {
			next();
		} else {
			req.flash("error", "Permission Denied!");
			res.redirect(`/listings/${id}`);
		}
	} else {
		next();
	}
};

module.exports.isReviewOwner = async (req, res, next) => {
	let {id, reviewId} = req.params;
	let result = await Review.findById(reviewId);
	if (result) {
		if (result.owner == req.user.id) {
			next();
		} else {
			req.flash("error", "Permission Denied!");
			res.redirect(`/listings/${id}`);
		}
	} else {
		next();
	}
};

module.exports.saveRedirectURL = (req, res, next) => {
	if (req.session.redirectURL) {
		res.locals.redirectURL = req.session.redirectURL;
	} else {
		res.locals.redirectURL = "/listings";
	}
	next();
};

module.exports.validateReview = (req, res, next) => {
	let {error} = reviewSchema.validate(req.body);
	if (error) {
		throw new ExpressError(400, error.message);
	}
	next();
};
module.exports.validateListing = (req, res, next) => {
	if (req.body.filters) {
		req.body.listing.filters = req.body.filters;
		delete req.body.filters;
	}
	let {error} = listingSchema.validate(req.body);
	if (error) {
		throw new ExpressError(400, error.message);
	}
	next();
};

module.exports.fixFilters = (req, res, next) => {
	for (let filter of filters) {
		delete filter.active;
	}
	if (req.query && req.query.filter) {
		for (let filter of filters) {
			if (filter.name == req.query.filter) {
				filter.active = true;
				break;
			}
		}
	}
	next();
};
