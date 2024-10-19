if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}

const express = require("express"); // framework
const path = require("path");
const methodOverride = require("method-override"); // to send delete and post requests
const ejsMate = require("ejs-mate"); // views or templates
const session = require("express-session"); // sessions  and cookies
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash"); //  for one time popups/alerts
const passport = require("passport"); // passport - for Authentication
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");
// Routers
const ListingRouter = require("./routers/listings.js");
const ReviewRouter = require("./routers/reviews.js");
const UserRouter = require("./routers/users.js");

const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// C0NNECTION WITH MONGO DB
const mongoose = require("mongoose");
// let database_URL = "mongodb://127.0.0.1:27017/Wanderlust";
let database_URL = process.env.ATLAS_URL;
async function main() {
	await mongoose.connect(database_URL);
}
main().catch((err) => {
	throw new ExpressError(err);
});

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
const store = MongoStore.create({
	mongoUrl: database_URL,
	crypto: {
		secret: process.env.SELECT,
	},
	touchAfter: 24 * 60 * 60,
});
const sessionOptions = {
	secret: `${process.env.SELECT}`,
	resave: false,
	saveUninitialized: true,
	cookie: {
		expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
	},
	store,
};

store.on("error", (err) => {
	console.log("ERROR IN MONGO SESSION STORE.");
	console.log(err);
});

app.use(session(sessionOptions));
app.use(flash());
app.use(cookieParser(process.env.SECRET));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("*", (req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.user = req.user;
	next();
});

// test Route
app.get("/", (req, res) => {
	res.redirect("/listings");
});

// routers
app.use("/", UserRouter);
app.use("/listings", ListingRouter);
app.use("/listings/:id/review", ReviewRouter);

app.all("*", (req, res, next) => {
	console.log(req.originalUrl);
	throw new ExpressError(
		404,
		"Error 404! Seems like the page you are looking for, doesn't exist!"
	);
});

// Error handling middleware
app.use((err, req, res, next) => {
	let {status = 500, message = "Some uncaught Error."} = err;
	console.log(err.message);
	res.status(status).render("listings/error.ejs", {err});
});

// Node server setup and start.
app.listen(8080, () => {
	console.log(`Server Started: ${new Date(Date.now()).toString()}`);
});
