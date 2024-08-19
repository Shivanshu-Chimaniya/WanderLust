const express = require("express");
const {
	isLoggedIn,
	isOwner,
	validateListing,
	isntOwner,
} = require("../utils/middlewares.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../utils/cloudConfig.js");
const {listing} = require("../utils/schemaConfigs.js");
const upload = multer({storage});

const router = express.Router();

router
	.route("/")
	.get(listingController.index)
	.post(
		isLoggedIn,
		upload.array("images"),
		validateListing,
		listingController.saveNewListing
	);

router.route("/add").get(isLoggedIn, listingController.renderAddForm);

router
	.route("/:id")
	.get(listingController.showListing)
	.put(
		isLoggedIn,
		isOwner,
		upload.array("images"),
		validateListing,
		listingController.editListing
	)
	.delete(isLoggedIn, isOwner, listingController.destroyListing);

router
	.route("/:id/edit")
	.get(isLoggedIn, isOwner, listingController.renderEditForm);

router.route("/:id/save").put(isLoggedIn, listingController.save);

router.route("/:id/unsave").put(isLoggedIn, listingController.unsave);

router.route("/:id/issaved").get(isLoggedIn, listingController.isSaved);

router.route("/:id/map").get(listingController.showMap);

router
	.route("/:id/book")
	.get(isLoggedIn, isntOwner, listingController.bookListing)
	.post(isLoggedIn, isntOwner, listingController.confirmBooking);

router.route("/:id/allBookings").get(listingController.showAllBookings);
router
	.route("/:id/canBook")
	.get(isLoggedIn, isntOwner, listingController.checkDates);

module.exports = router;
