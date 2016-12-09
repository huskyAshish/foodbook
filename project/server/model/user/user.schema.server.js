module.exports = function () {
    var mongoose = require("mongoose");
    // var ReviewSchema = require("./review.schema.server.js")(mongoose);
    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        facebook:   {
            id:    String,
            token: String
        },
        google:   {
            id:    String,
            token: String
        },
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        // review: [ReviewSchema],
        // likes:[String],
        friends : [String],
        type : {type : String, default : "project"},
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'foodbooker'});

    return UserSchema;
};