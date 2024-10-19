const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.invalidFix = (req, res) => {
	let id = req.params.id;
	res.redirect(`/listings/${id}`);
};

module.exports.saveReview = wrapAsync(async (req, res) => {
	let id = req.params.id;
	let listing = await Listing.findById(id);
	let owner = await User.findByUsername(req.user.username);
	if (!listing) {
		req.flash("error", "Listing Not In Database!");
		res.redirect("/listings");
	}
	if (!owner) throw new Error("user not found in database!");

	let newReview = new Review(req.body.review);
	newReview.owner = owner;
	newReview.listing = listing;
	await newReview.save();

	owner.postedReviews.push(newReview);
	await owner.save();

	listing.reviews.push(newReview);
	await listing.save();
	req.flash("success", "Review Added Successfully!");
	res.redirect(`/listings/${id}`);
});

module.exports.destroyReview = wrapAsync(async (req, res) => {
	let {id, reviewId} = req.params;
	let listing = await Listing.findById(id);
	if (!listing) {
		req.flash("error", "Listing Not In Database!");
		res.redirect("/listings");
	}
	if (!listing.reviews.includes(reviewId)) {
		req.flash("error", "Review doesn't belong to this listing.");
		res.redirect("/listings/${id}");
	}

	// logged in user is review owner is checked in a middleware before so no need to check again.
	let user = await User.findByUsername(req.user.username);
	if (!user) throw new Error("user not found in database!");
	user.postedReviews.splice(user.postedReviews.indexOf(reviewId), 1);
	listing.reviews.splice(listing.reviews.indexOf(reviewId), 1);
	await user.save();
	await listing.save();
	let result = await Review.findByIdAndDelete(reviewId);
	req.flash(
		result ? "success" : "error",
		result ? "Review Deleted Successfully!" : "Review Doesn't Exist!"
	);
	res.redirect(`/listings/${id}`);
});
