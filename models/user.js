const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const userConfig = require("../utils/schemaConfigs").user;

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		require: true,
	},
	lastName: {
		type: String,
	},
	email: {
		type: String,
		require: true,
	},
	contact: {
		type: String,
		require: true,
	},
	postedListings: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Listing",
		},
	],
	savedListings: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Listing",
		},
	],
	bookings: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Booking",
		},
	],
	postedReviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review",
		},
	],
});

userSchema.plugin(passportLocalMongoose);

let User = mongoose.model("User", userSchema);
module.exports = User;
