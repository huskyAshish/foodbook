module.exports = function () {
    var mongoose = require("mongoose");
    var RestaurantSchema = mongoose.Schema({
        _id: String,
        name: String,
        location: String,
        thumbnail_url: String,
        rating: Number,
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'restaurant'});

    return RestaurantSchema;
};