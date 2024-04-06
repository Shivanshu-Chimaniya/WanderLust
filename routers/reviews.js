const express = require("express");
const {isLoggedIn, isReviewOwner} = require("../middlewares.js");
const {validateReview} = require("../middlewares.js");
const reviewController = require("../controllers/review.js");

const router = express.Router({mergeParams: true});
router
	.route("/")
	.get(reviewController.invalidFix)
	.post(validateReview, isLoggedIn, reviewController.saveReview);

router.delete(
	"/:reviewId",
	isLoggedIn,
	isReviewOwner,
	reviewController.destroyReview
);

module.exports = router;
