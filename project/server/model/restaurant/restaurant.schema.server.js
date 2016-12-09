module.exports = function () {
    var mongoose = require("mongoose");
    var RestaurantSchema = mongoose.Schema({
        name: String,
        location: String,
        thumbnail_url: String,
        rating: Number,
        reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'ReviewModel'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'restaurant'});

    return RestaurantSchema;
};