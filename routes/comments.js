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

// EDIT - comment
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("/back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE - comment
router.put("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY - comment
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// middleware to check for comment ownership
function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        //does user own campground
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else{
                //does user own comment
                if(foundComment.author.id.equals(req.user._id)){
                    next(); //move to the next part of the function or body
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

// function(middleware) tp check whether the user is logged in or not
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
