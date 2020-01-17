const express = require('express'),
	router = express.Router(),
	Campground = require('../models/campground'),
	Comment = require('../models/comment'),
	middleware = require('../middleware/index');

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
router.post('/', middleware.isLoggedIn, (req, res) => {
	const name = req.body.name;
	const image = req.body.image;
	const description = req.body.description;
	const price = req.body.price;
	const author = {
		id: req.user._id,
		username: req.user.username
	};
	const newCampground = { name: name, price: price, image: image, description: description, author: author };
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
router.get('/new', middleware.isLoggedIn, (req, res) => {
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

// EDIT campgrond route
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render('campgrounds/edit', { campground: foundCampground });
	});
});

// UPDATE campground route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
	// redirect to show page
});

// DESTROY campground route
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndDelete(req.params.id, (err) => {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;
