var Campground = require("../models/campground");
var Comment = require("../models/comment");

// All the middleware goes here
var middlewareObj = {};

// middleware to check for campground ownership
middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                if (!foundCampground) {
                    req.flash("error", "Item not found");
                    return res.redirect("back");
                }
                // does user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You don't have permission to do that!");
        res.redirect("back");
    }
};

// middleware to check for comment ownership
middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        // does user own comment
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if (!foundComment) {
                    req.flash("error", "Item not found");
                    return res.redirect("back");
                }
                // does user own the comment
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You don't have permission to do that!");
        res.redirect("back");
    }
};

// function(middleware) tp check whether the user is logged in or not
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;
