const mongoose = require("mongoose");
const allFilter = require("../utils/filters");
const listingConfig = require("../utils/schemaConfigs").listing;
const filters = allFilter.map((el) => el.name);

let ListingSchema = mongoose.Schema({
	title: {
		type: String,
		minLength: listingConfig.titleMinLength,
		maxLength: listingConfig.titleMaxLength,
		required: true,
	},
	description: {
		type: String,
		minLength: listingConfig.descriptionMinLength,
		maxLength: listingConfig.descriptionMaxLength,
		required: true,
	},
	images: {
		type: [
			{
				url: {
					type: String,
					required: true,
				},
				filename: {
					type: String,
					required: true,
				},
				publicId: {
					type: String,
					required: true,
				},
			},
		],
		validate: [arraylimit, "{path} exceeds the the limit of 5."],
	},
	actualPrice: {
		type: Number,
		min: listingConfig.minimumActualPrice,
		max: listingConfig.maximumActualPrice,
		required: true,
	},
	discountedPrice: {
		type: Number,
		min: listingConfig.minimumDiscountedPrice,
		max: listingConfig.maximumDiscountedPrice,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	latitude: {
		type: Number,
		min: -90,
		max: 90,
	},
	longitude: {
		type: Number,
		min: -180,
		max: 180,
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
		required: true,
	},
	filters: [
		{
			type: String,
			enum: filters,
		},
	],
	bookings: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Booking",
		},
	],
});

let Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;

function arraylimit(val) {
	return val.length <= 5;
}
