var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");

//creates and connects mongoose to DB yelp_camp
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//default route- homepage YelpCamp
app.get("/", function (req, res) {
    res.render("landing");    
});

//Shows all campgrounds from the Mongo Database
app.get("/campgrounds", function (req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            //renders the campgrounds which are in the db
            // {campgrounds(in the campgrounds.ejs page campgrounds, another file): allCampgrounds(in the function allCampgrounds)}
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    });
});

//shows the add new campground page
app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");    
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function (req, res) {
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

//adds the new campground using a POST request
app.post("/campgrounds", function (req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampgrounds = { name: name, image: image, description: desc };
    //instead of campgrounds.push(newCampgrounds);
    //data persistance
    //Create a new campground and add to DB
    Campground.create(newCampgrounds, function (err, newCamp) {
        if (err) {
            console.log(err);
        }
        else {
            //redirect to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// ==================
// COMMENTS ROUTES
// ==================

app.get("/campgrounds/:id/comments/new", function(req, res){
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

app.post("/campgrounds/:id/comments", function(req, res){
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
                    campground.comments.push(comment); //push that comment into the campground
                    campground.save(); //save the campground
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//Server listens on PORT 3000
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server listening on port " +  port);    
});