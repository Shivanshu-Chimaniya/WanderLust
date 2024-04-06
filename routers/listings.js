const express = require("express");
const {
	isLoggedIn,
	isOwner,
	validateListing,
	fixFilters,
} = require("../middlewares.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const router = express.Router();

router
	.route("/")
	.get(fixFilters, listingController.index)
	.post(
		isLoggedIn,
		upload.single("listingImage"),
		listingController.saveNewListing
	);

router.route("/add").get(isLoggedIn, listingController.renderAddForm);

router
	.route("/:id")
	.get(listingController.showListing)
	.put(
		isLoggedIn,
		isOwner,
		upload.single("listingImage"),
		validateListing,
		listingController.editListing
	)
	.delete(isLoggedIn, isOwner, listingController.destroyListing);

router
	.route("/:id/edit")
	.get(isLoggedIn, isOwner, listingController.renderEditForm);

module.exports = router;
