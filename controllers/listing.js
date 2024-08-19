const {Listing, Review, User, Booking} = require("../models/index.js");
const wrapAsync = require("../utils/wrapAsync.js");
const filters = require("../utils/filters.js");
const {cloudinary} = require("../utils/cloudConfig.js");

module.exports.index = wrapAsync(async (req, res) => {
	let allListings = await Listing.find({});
	let listings = [];
	if (!allListings) {
		req.flash("error", "Loading Error!!");
		res.render("listings/listings.ejs", {
			listings,
			filters,
		});
		return;
	}
	for (let listing of allListings) {
		let str =
			listing.filters.length > 0
				? listing.filters.reduce((str, el) => str + "/" + el)
				: "";
		listings.push({
			id: listing.id,
			title: listing.title,
			actualPrice: listing.actualPrice,
			discountedPrice: listing.discountedPrice,
			images: listing.images,
			filters: str,
		});
	}
	res.render("listings/listings.ejs", {
		listings,
		filters,
	});
});

module.exports.renderAddForm = (req, res) => {
	res.render("listings/add.ejs", {filters});
};

module.exports.saveNewListing = wrapAsync(async (req, res) => {
	let newListing = new Listing(req.body.listing);
	let searchAddress =
		newListing.address.replace(" ", "+") +
		"+" +
		newListing.city.replace(" ", "+") +
		"+" +
		newListing.country.replace(" ", "+");
	try {
		let data = await fetch(
			`https://geocode.search.hereapi.com/v1/geocode?q=` +
				searchAddress +
				`&apiKey=` +
				`${HEREMAPS_API_KEY}`
		);
		let result = await data.json();
		let coords = result.items[0].position;
		newListing.latitude = coords.lat;
		newListing.longitude = coords.lng;
	} catch (err) {
		throw new ExpressError("Couldn't save! something wrong with map API.");
	}
	let user = await User.findOne({"username": req.user.username});
	newListing.owner = req.user;
	user.postedListings.push(newListing);
	await user.save();
	await newListing.save();
	req.flash("success", "A New Listing Was Added Successfully!");
	res.redirect("/listings");
});

module.exports.showListing = wrapAsync(async (req, res) => {
	let {id} = req.params;
	let reqListing = await Listing.findById(id).populate("owner");
	if (!reqListing) {
		req.flash("error", "Listing Not In Database!");
		res.redirect("/listings");
	}
	let reviews = [];
	for (let reviewId of reqListing.reviews) {
		let currRev = await Review.findById(reviewId).populate("owner");
		if (currRev) reviews.push(currRev);
	}
	reqListing.reviews = reviews;
	res.render("listings/show.ejs", {listing: reqListing});
});

module.exports.renderEditForm = wrapAsync(async (req, res) => {
	let listing = await Listing.findById(req.params.id);
	let originalImages = [];
	for (let image of listing.images) {
		originalImages.push(image.url.replace("upload/", "upload/w_200/"));
	}
	if (listing) {
		res.render("listings/edit.ejs", {listing, originalImages, filters});
	} else {
		req.flash("error", "Listing Not In Database!");
		res.redirect("/listings");
	}
});

module.exports.editListing = wrapAsync(async (req, res) => {
	let id = req.params.id;
	let original = await Listing.findById(id);
	if (req.files.length == 0) {
		req.body.listing.images = original.images;
	} else {
		for (let image of original.images) {
			await cloudinary.uploader.destroy(image.publicId, (err, res) => {
				if (err) {
					console.log(err);
				}
			});
		}
	}
	// if address updates
	if (
		!(
			original.address == req.body.listing.address &&
			original.city == req.body.listing.city &&
			original.country == req.body.listing.country
		)
	) {
		let searchAddress =
			req.body.listing.address.replace(" ", "+") +
			"+" +
			req.body.listing.city.replace(" ", "+") +
			"+" +
			req.body.listing.country.replace(" ", "+");
		let data = await fetch(
			`https://geocode.search.hereapi.com/v1/geocode?q=` +
				searchAddress +
				`&apiKey=` +
				`${HEREMAPS_API_KEY}`
		);
		let result = await data.json();
		let coords = result.items[0].position;
		req.body.listing.latitude = coords.lat;
		req.body.listing.longitude = coords.lng;
	}
	let result = await Listing.findByIdAndUpdate(id, req.body.listing);
	if (result) {
		req.flash("success", "Listing Edited Successfully!!");
		res.redirect(`/listings/${id}`);
	} else {
		req.flash("error", "Listing Not In Database!");
		res.redirect("/listings");
	}
});

module.exports.destroyListing = wrapAsync(async (req, res) => {
	let id = req.params.id;
	let deletedVal = await Listing.findByIdAndDelete(id);

	if (deletedVal) {
		let user = await User.findByUsername(req.user.username);
		user.postedListings.splice(user.postedListings.indexOf(id), 1);
		await user.save();

		for (let x of deletedVal.reviews) {
			let owner = await Review.findByIdAndDelete(`${x}`).owner;
			owner.postedReviews.splice(user.postedReviews.indexOf(x), 1);
			await owner.save();
		}
		for (let image of deletedVal.images) {
			await cloudinary.uploader.destroy(image.publicId, (err, res) => {
				if (err) {
					console.log(err);
				}
			});
		}
		req.flash("success", "Listing Succesfully Deleted!");
		res.redirect(`/listings`);
	} else {
		req.flash("error", "Listing Not In Database!");
		res.redirect("/listings");
	}
});

module.exports.save = wrapAsync(async (req, res) => {
	let {id} = req.params;
	let user = await User.findById(req.user.id);
	if (!user.savedListings.includes(id)) {
		user.savedListings.push(id);
		await user.save();
	}
	let response = {success: true};
	res.send(JSON.stringify(response));
});

module.exports.unsave = wrapAsync(async (req, res) => {
	let {id} = req.params;
	let user = await User.findById(req.user.id);
	if (user.savedListings.includes(id)) {
		user.savedListings.splice(user.savedListings.indexOf(id), 1);
		await user.save();
	}
	let response = {success: true};
	res.send(JSON.stringify(response));
});

module.exports.isSaved = wrapAsync(async (req, res) => {
	let {id} = req.params;
	let user = await User.findById(req.user.id);
	let result = user.savedListings.includes(id);
	let response = {success: true, isSaved: result};
	res.send(JSON.stringify(response));
});

module.exports.showMap = wrapAsync(async (req, res) => {
	let {id} = req.params;

	let listing = await Listing.findById(id);
	let coords = {latitude: listing.latitude, longitude: listing.longitude};
	res.render("listings/showMap.ejs", {listing, coords});
});

module.exports.bookListing = wrapAsync(async (req, res) => {
	let {id} = req.params;
	let listing = await Listing.findById(id)
		.populate("owner")
		.populate("bookings");
	let allBookings = [];
	for (let booking of listing.bookings) {
		let currentDate = new Date(booking.fromDate);
		const endDate = new Date(booking.toDate);

		while (currentDate <= endDate) {
			allBookings.push(getDateString(currentDate));
			currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
		}
	}
	function getDateString(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}
	res.render("listings/book.ejs", {listing, allBookings});
});

module.exports.confirmBooking = wrapAsync(async (req, res) => {
	let {id} = req.params;
	let [y1, m1, d1] = req.body.date1.split("-");
	let [y2, m2, d2] = req.body.date2.split("-");

	let from = new Date();
	from.setHours(5, 30, 0, 0);
	from.setFullYear(y1, m1 - 1, d1);
	let to = new Date();
	to.setHours(5, 30, 0, 0);
	to.setFullYear(y2, m2 - 1, d2);

	console.log("confirmong - ");
	console.log(from);
	console.log(to);

	let listing = await Listing.findById(id);
	let owner = await User.findByUsername(req.user.username);

	let totalDays = Math.floor((to - from) / (1000 * 3600 * 24)) + 1;
	let totalAmount = totalDays * listing.discountedPrice;
	let newBooking = new Booking({
		fromDate: from,
		toDate: to,
		totalDays,
		totalAmount,
		owner: owner,
		listing: listing,
	});
	await newBooking.save();
	owner.bookings.push(newBooking);
	await owner.save();
	listing.bookings.push(newBooking);
	await listing.save();
	req.flash("success", "Good luck, finding the place!!");
	res.redirect(`/listings/${id}`);
});

module.exports.checkDates = wrapAsync(async (req, res) => {
	let {id} = req.params;
	let {d1, m1, y1, d2, m2, y2} = req.query;
	let from = new Date();
	from.setHours(5, 30, 0, 0);
	from.setFullYear(y1, m1, d1);
	let to = new Date();
	to.setHours(5, 30, 0, 0);
	to.setFullYear(y2, m2, d2);
	let listing = await Listing.findById(id);
	let allBookings = listing.bookings;
	for (let booking of allBookings) {
		let currBooking = await Booking.findById(booking);
		let start = currBooking.fromDate;
		let end = currBooking.toDate;
		const overlap = from <= end && start <= to;
		if (overlap) {
			console.log("fail");
			let response = {success: false};
			res.send(JSON.stringify(response));
		}
	}
	let days = Math.floor((to - from) / (1000 * 3600 * 24)) + 1;
	let response = {
		success: true,
		listingName: listing.title,
		actualPrice: listing.actualPrice,
		discountedPrice: listing.discountedPrice,
		totalDays: days,
	};
	res.send(JSON.stringify(response));
});

module.exports.showAllBookings = wrapAsync(async (req, res) => {
	let {id} = req.params;
	let listing = await Listing.findById(id);
	let allBookings = [];
	for (let bookingId of listing.bookings) {
		let currbooking = await Booking.findById(bookingId).populate("owner");
		let currInfo = {
			fromDate: currbooking.fromDate,
			toDate: currbooking.toDate,
			totalDays: currbooking.totalDays,
			totalAmount: currbooking.totalAmount,
			owner: {
				username: currbooking.owner.username,
				id: currbooking.owner.id,
			},
		};
		allBookings.push(currInfo);
	}
	let b = allBookings.sort((a, b) => a.fromDate - b.fromDate);
	console.log(allBookings);
	console.log(b);
	res.render("listings/bookings.ejs", {
		listing: {
			id: listing.id,
		},
		allBookings,
	});
});
