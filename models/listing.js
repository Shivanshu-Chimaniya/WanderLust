const mongoose = require("mongoose");
const allFilter = require("../utils/filters");
const filters = allFilter.map((el) => el.name);

let ListingSchema = mongoose.Schema({
	title: {
		type: String,
	},
	description: {
		type: String,
	},
	image: {
		url: {
			type: String,
		},
		filename: {
			type: String,
		},
	},
	price: {
		type: Number,
	},
	location: {
		type: String,
	},
	country: {
		type: String,
	},
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review",
		},
	],
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	filters: [
		{
			type: String,
			enum: filters,
		},
	],
});

let Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
