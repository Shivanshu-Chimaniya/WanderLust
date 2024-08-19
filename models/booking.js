const mongoose = require("mongoose");
const bookingsConfig = require("../utils/schemaConfigs").booking;

let BookingSchema = mongoose.Schema({
	fromDate: {
		type: Date,
		require: true,
	},
	toDate: {
		type: Date,
		require: true,
	},
	totalDays: {
		type: Number,
		require: true,
	},
	totalAmount: {
		type: Number,
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
	transactionId: {
		type: String,
		default: "1234",
		require: true,
	},
});

let Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;
