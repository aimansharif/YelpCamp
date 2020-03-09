//SCHEMA SETUP
var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

//creates a mongoose model schema
module.exports = mongoose.model("Campground", campgroundSchema)

// var Campground = mongoose.model("Campground", campgroundSchema);
