const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const upload = multer({dest: "uploads/"});
const filters = require("../utils/filters.js");

module.exports.index = wrapAsync(async (req, res) => {
	let allListings;
	if (req.query.filter) {
		let filter = req.query.filter;
		allListings = await Listing.find({filters: filter});
	} else {
		allListings = await Listing.find({});
	}
	res.locals.loadFilters = true;
	res.render("listings/listings.ejs", {
		listings: allListings,
		filters: filters,
	});
});

module.exports.renderAddForm = (req, res) => {
	res.render("listings/add.ejs", {filters});
};
module.exports.saveNewListing = wrapAsync(async (req, res) => {
	let newListing = new Listing(req.body.listing);
	newListing.filters = req.body.filters;
	newListing.reviews = [];
	newListing.owner = req.user;
	if (req.file) {
		newListing.image = {url: req.file.path, filename: req.file.filename};
	} else {
		newListing.image = {
			url: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
			filename: "listing image",
		};
	}
	await newListing.save();
	req.flash("success", "A New Listing Was Added Successfully!");
	res.redirect("/listings");
});

module.exports.showListing = wrapAsync(async (req, res) => {
	let {id} = req.params;
	const reqListing = await Listing.findById(id).populate("owner");
	if (!reqListing) {
		req.flash("error", "Listing Not In Database!");
		res.redirect("/listings");
	}
	let reviews = [];
	for (let reviewId of reqListing.reviews) {
		let currRev = await Review.findById(reviewId).populate("owner");
		if (currRev) {
			reviews.push(currRev);
		} else {
			await Listing.findByIdAndUpdate(id, {
				$pull: {reviews: reviewId},
			});
			req.flash("error", "check console");
		}
	}
	res.render("listings/show.ejs", {listing: reqListing, reviews});
});

module.exports.renderEditForm = wrapAsync(async (req, res) => {
	let listing = await Listing.findById(req.params.id);
	let originalImageUrl = listing.image.url;
	originalImageUrl.replace("/upload", "/upload/w_150");

	if (listing) {
		res.render("listings/edit.ejs", {listing, originalImageUrl, filters});
	} else {
		req.flash("error", "Listing Not In Database!");
		res.redirect("/listings");
	}
});

module.exports.editListing = wrapAsync(async (req, res) => {
	let id = req.params.id;
	let result = await Listing.findByIdAndUpdate(id, req.body.listing);
	if (req.file) {
		let listing = await Listing.findById(id);
		listing.image = {url: req.file.path, filename: req.file.filename};
		await listing.save();
	}
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
		for (let x of deletedVal.reviews) {
			await Review.findByIdAndDelete(`${x}`);
		}
		req.flash("success", "Listing Succesfully Deleted!");
		res.redirect(`/listings`);
	} else {
		req.flash("error", "Listing Not In Database!");
		res.redirect("/listings");
	}
});
