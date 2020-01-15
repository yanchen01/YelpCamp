const express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	app = express(),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	seedDB = require('./seeds');

const Mongo_URI = 'mongodb://localhost/yelp_camp';
mongoose.connect(Mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

seedDB();
/* Campground.create(
	{
		name: 'Granite Hill',
		image: 'https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg',
		description: 'This is a huge granite hill, no bathrooms. No water. Beautiful granite!'
	},
	(err, campground) => {
		if (err) {
			console.log(err);
		} else {
			console.log('new campground created');
			console.log(campground);
		}
	}
); */

app.get('/', (req, res) => {
	res.render('landing');
});

/*  ********** CAMPGROUNDS ROUTES ********** */
// INDEX - show all campgrounds
app.get('/campgrounds', (req, res) => {
	Campground.find({}, (err, campgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('index', { campgrounds: campgrounds });
		}
	});
});
// CREATE - add new campground to database
app.post('/campgrounds', (req, res) => {
	const name = req.body.name;
	const image = req.body.image;
	const description = req.body.description;
	const newCampground = { name: name, image: image, description: description };
	// create a new campground and save to database
	Campground.create(newCampground, (err, newlyCreated) => {
		if (err) {
			console.log(err);
		} else {
			// redirect back to campgrounds page
			res.redirect('/campgrounds');
		}
	});
});
// NEW - show form to create new campground
app.get('/campgrounds/new', (req, res) => {
	res.render('new.ejs');
});
// SHOW - shows info about one campground
app.get('/campgrounds/:id', (req, res) => {
	Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render('show', { campground: foundCampground });
		}
	});
});

app.listen(3000, () => {
	console.log('YelpCamp Server has started on port 3000');
});
