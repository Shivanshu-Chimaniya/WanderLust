class ExpressError extends Error {
	constructor(status, message = "noMessage") {
		super();
		this.status = status;
		this.message = message;
	}
}

module.exports = ExpressError;
