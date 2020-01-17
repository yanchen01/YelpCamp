const express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	app = express(),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	User = require('./models/user'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	seedDB = require('./seeds'),
	methodOverride = require('method-override');

// requiring routes
const commentRoutes = require('./routes/comments'),
	campgroundRoutes = require('./routes/campground'),
	indexRoutes = require('./routes/index');

// ------------------------------------------ //
// 			MONGOOSE CONFIGURATION
// ------------------------------------------ //
const Mongo_URI = 'mongodb://localhost/yelp_camp';
mongoose.connect(Mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

// ------------------------------------------ //
// 			PASSPORT CONFIGURATION
// ------------------------------------------ //
app.use(
	require('express-session')({
		secret: 'Rusty is the cutest dog!',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// seedDB(); // seed the detabase

app.listen(3000, () => {
	console.log('YelpCamp Server has started on port 3000');
});
