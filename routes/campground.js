const express = require('express'),
	router = express.Router(),
	Campground = require('../models/campground'),
	Comment = require('../models/comment');

/*  ********** CAMPGROUNDS ROUTES ********** */

// INDEX - show all campgrounds
router.get('/', (req, res) => {
	Campground.find({}, (err, campgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', { campgrounds: campgrounds, currentUser: req.user });
		}
	});
});

// CREATE - add new campground to database
router.post('/', isLoggedIn, (req, res) => {
	const name = req.body.name;
	const image = req.body.image;
	const description = req.body.description;
	const author = {
		id: req.user._id,
		username: req.user.username
	};
	const newCampground = { name: name, image: image, description: description, author: author };
	// create a new campground and save to database
	Campground.create(newCampground, (err, newlyCreated) => {
		if (err) {
			console.log(err);
		} else {
			// redirect back to campgrounds page
			res.redirect('/');
		}
	});
});

// NEW - show form to create new campground
router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new.ejs');
});

// SHOW - shows info about one campground
router.get('/:id', (req, res) => {
	Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/show', { campground: foundCampground });
		}
	});
});

// middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;
