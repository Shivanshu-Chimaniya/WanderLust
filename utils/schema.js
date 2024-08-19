const Joi = require("joi");
const filters = require("./filters");
const config = require("./schemaConfigs");

module.exports.listingSchema = Joi.object({
	listing: Joi.object({
		title: Joi.string()
			.min(config.listing.titleMinLength)
			.max(config.listing.titleMaxLength)
			.required(),
		description: Joi.string()
			.min(config.listing.descriptionMinLength)
			.max(config.listing.descriptionMaxLength)
			.required(),
		actualPrice: Joi.number()
			.min(config.listing.minimumActualPrice)
			.max(config.listing.maximumActualPrice)
			.required(),
		discountedPrice: Joi.number()
			.min(config.listing.minimumDiscountedPrice)
			.max(config.listing.maximumDiscountedPrice)
			.required(),
		city: Joi.string().required(),
		country: Joi.string().required(),
		address: Joi.string().required(),
		latitude: Joi.number().min(-90).max(90).allow(null),
		longitude: Joi.number().min(-180).max(180).allow(null),
		images: Joi.array()
			.min(config.listing.minImages)
			.max(config.listing.maxImages)
			.items(
				Joi.object({
					url: Joi.string(),
					filename: Joi.string(),
					publicId: Joi.string(),
				}).allow(null)
			),
		filters: Joi.array().items(Joi.string()).allow(null),
	}).required(),
});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number()
			.min(config.review.minRating)
			.max(config.review.maxRating)
			.required(),
		comment: Joi.string()
			.min(config.review.commentMinLength)
			.max(config.review.commentMaxLength)
			.required(),
	}).required(),
});

module.exports.userSchema = Joi.object({
	user: Joi.object({
		firstName: Joi.string().required(),
		lastName: Joi.string(),
		email: Joi.string().required(),
		contact: Joi.string().required(),
	}).required(),
});
