const express = require('express'),
	Campground = require('../models/campground'),
	Comment = require('../models/comment'),
	router = express.Router({ mergeParams: true }), // allow req params to pass from diff js files
	middleware = require('../middleware/index');

// ------------------------------------------ //
// 				COMMENTS ROUTES
// ------------------------------------------ //
// Comments new
router.get('/new', middleware.isLoggedIn, (req, res) => {
	// find campground by id
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
});

// Comments create
router.post('/', middleware.isLoggedIn, (req, res) => {
	// look up campground by id
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			req.flash('error', 'Something went wrong');
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			// create new comment
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					console.log(err);
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					// connect new comment to campground
					campground.comments.push(comment);
					campground.save();

					// redirect campground show page
					req.flash('success', 'Successfully added comment');
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

// Comment EDIT
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if (err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
		}
	});
});

// comment update
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment) => {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// comment destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err, foundComment) => {
		if (err) {
			res.redirect('back');
		} else {
			req.flash('success', 'Comment deleted');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

module.exports = router;
