var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// redirects user to create new comment, check if logged in, only allow to create comment if user is logged in
// Comments - NEW
router.get("/new", isLoggedIn, function(req, res){
    // Find campground by id
    // After finding the id, we can use that id to associate it with the comments
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            // Render the form
            res.render("comments/new", {campground: campground});
        }
    });
});

// Comments - CREATE
router.post("/", isLoggedIn, function(req, res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
            //create new comments
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username  = req.user.username;
                    // save the comment
                    comment.save();
                    campground.comments.push(comment); //push that comment into the campground
                    campground.save(); //save the campground
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// function(middleware) tp check whether the user is logged in or not
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
