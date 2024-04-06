const mongoose = require("mongoose");

let ReviewSchema = mongoose.Schema({
	rating: {
		type: Number,
		min: 1,
		max: 5,
	},
	comment: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

let Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
