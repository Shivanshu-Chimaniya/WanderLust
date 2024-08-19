const mongoose = require("mongoose");
const reviewConfig = require("../utils/schemaConfigs").review;

let ReviewSchema = mongoose.Schema({
	rating: {
		type: Number,
		min: reviewConfig.minRating,
		max: reviewConfig.maxRating,
		require: true,
	},
	comment: {
		type: String,
		minLength: reviewConfig.commentMinLength,
		maxLength: reviewConfig.commentMaxLength,
		require: true,
	},
	date: {
		type: Date,
		default: Date.now(),
		require: true,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		require: true,
	},
	listing: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Listing",
		require: true,
	},
});

let Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
