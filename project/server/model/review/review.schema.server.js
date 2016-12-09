module.exports = function () {
    var mongoose = require("mongoose");
    var ReviewSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.ObjectId, ref: "UserModel"},
        _restaurant: {type: mongoose.Schema.ObjectId, ref: "RestaurantModel"},
        review: String,
        rating: Number,
        image_url: String,
        dateCreated: {type: Date, default: Date.now},
        dateUpdated: {type: Date, default: Date.now}
    }, {collection: 'review'});

    return ReviewSchema;
};