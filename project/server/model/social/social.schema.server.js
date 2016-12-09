module.exports = function () {
    var mongoose = require("mongoose");
    var SocialSchema =  mongoose.Schema({
            userId      : String,
            username    : String,
            followerId  : String,
            followerName : String,
            dateFollowed : {type: Date, default: Date.now()}
        }, {collection: "social"});

    return SocialSchema;
};