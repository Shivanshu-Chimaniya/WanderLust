const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.invalidFix = (req, res) => {
	let id = req.params.id;
	res.redirect(`/listings/${id}`);
};

module.exports.saveReview = wrapAsync(async (req, res) => {
	let id = req.params.id;
	let listing = await Listing.findById(id);
	if (listing) {
		let newReview = new Review(req.body.review);
		newReview.owner = req.user;
		await newReview.save();

		listing.reviews.push(newReview);
		await listing.save();

		req.flash("success", "Review Added Successfully!");
		res.redirect(`/listings/${id}`);
	} else {
		req.flash("error", "Listing Not In Database!");
		res.redirect("/listings");
	}
});

module.exports.destroyReview = wrapAsync(async (req, res) => {
	let {id, reviewId} = req.params;
	let result = await Review.findByIdAndDelete(reviewId);
	if (!result) {
		req.flash("error", "Review Doesn't Exist!");
		res.redirect(`/listings/${id}`);
	}
	let result2 = await Listing.findByIdAndUpdate(id, {
		$pull: {reviews: reviewId},
	});
	if (!result2) {
		req.flash("error", "Listing Not In Database!");
		res.redirect("/listings");
	}
	req.flash("success", "Review Deleted Successfully!");
	res.redirect(`/listings/${id}`);
});
