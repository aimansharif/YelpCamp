var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");

// INDEX - shows all campgrounds from the Mongo Database
router.get("/", function (req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            //renders the campgrounds which are in the db
            // {campgrounds(in the campgrounds.ejs page campgrounds, another file): allCampgrounds(in the function allCampgrounds)}
            res.render("campgrounds/index", { campgrounds: allCampgrounds , currentUser: req.user});
        }
    });
});

// NEW - shows the form to add new campground page
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
    //find campgrounds with provided ID

    //Finding a campground using findbyId, populating the comments on that campground and then with .exec executes the function with the call back 
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//CREATE - adds the new campground using a POST request
router.post("/", isLoggedIn, function (req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampgrounds = { name: name, image: image, description: desc, author: author};
    //instead of campgrounds.push(newCampgrounds);
    //Create a new campground and add to DB - //data persistance
    Campground.create(newCampgrounds, function (err, newCamp) {
        if (err) {
            console.log(err);
        }
        else {
            //redirect to campgrounds page
            console.log(newCamp);
            res.redirect("/campgrounds");
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
