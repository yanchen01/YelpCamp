const express = require('express'),
	bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let campGrounds = [
	{ name: 'Salmon Creek', image: 'https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg' },
	{ name: 'Granite Hill', image: 'https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg' },
	{ name: "Mountain Goat's Rest", image: 'https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg' }
];

app.get('/', (req, res) => {
	res.render('landing');
});

// campgrounds routes
app.get('/campgrounds', (req, res) => {
	res.render('campgrounds', { campGrounds: campGrounds });
});

app.post('/campgrounds', (req, res) => {
	// get data from form and add to campgrounds array
	// redirect back to campgrounds page
	const name = req.body.name;
	const image = req.body.image;
	const newCampground = {name: name, image: image};
	campGrounds.push(newCampground);
	
	res.redirect('/campgrounds');
});
// let user upload a new campground
app.get('/campgrounds/new', (req, res) => {
	res.render('new.ejs');
});

app.listen(3000, () => {
	console.log('YelpCamp Server has started on port 3000');
});
