const Joi = require("joi");
const filters = require("./utils/filters");

module.exports.listingSchema = Joi.object({
	listing: Joi.object({
		title: Joi.string().required(),
		description: Joi.string().required(),
		location: Joi.string().required(),
		country: Joi.string().required(),
		price: Joi.number().required(),
		image: Joi.object({
			url: Joi.string(),
			filename: Joi.string(),
		}).allow(null),
		filters: Joi.array().items(Joi.string()).allow(null),
	}).required(),
});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().min(1).max(5).required(),
		comment: Joi.string().required(),
	}).required(),
});
