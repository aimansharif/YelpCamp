var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware");

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
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

//CREATE - adds the new campground using a POST request
router.post("/", middleware.isLoggedIn, function (req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, price: price, image: image, description: desc, author: author};
    //instead of campgrounds.push(newCampgrounds);
    //Create a new campground and add to DB - //data persistance
    Campground.create(newCampground, function (err, newCamp) {
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

// EDIT - Campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    //check whether user is logged in
    Campground.findById(req.params.id, function(err, foundCampground){
        //does user own campground
        if(foundCampground.author.id.equals(req.user._id)){
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE Campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// DESTROY - Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
