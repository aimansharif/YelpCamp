var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

//creates and connects mongoose to DB yelp_camp
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Creates a new campgrounda and adds it to the database
Campground.create({
    name: "Granite Hill",
    image: "https://image.shutterstock.com/image-photo/man-looking-stars-next-campfire-260nw-603533180.jpg",
    description: "This is a huge granite hill"
},
    function (err, campground) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("NEW CAMPGROUND CREATED");
        console.log(campground);
    }
});

app.get("/", function (req, res) {
    res.render("landing");    
});

app.get("/campgrounds", function (req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            //renders the campgrounds which are in the db
            // {campgrounds(in the campgrounds.ejs page campgrounds, another file): allCampgrounds(in the function allCampgrounds)}
            res.render("index", { campgrounds: allCampgrounds });
        }
    });
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new");    
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function (req, res) {
    //find campgrounds with provided ID
    Campground.findById(req.params.id, function (err, foundCamp) {
        if (err) {
            console.log(err);
        }
        else {
            //render show template with that campground
            res.render("show", {campground: foundCamp});
        }
    });
});

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

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server listening on port 3000");    
});