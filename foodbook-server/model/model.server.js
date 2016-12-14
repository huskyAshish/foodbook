module.exports = function () {

    var userModel = require("./user/user.model.server.js")();
    var reviewModel = require("./review/review.model.server.js")();
    var restaurantModel = require("./restaurant/restaurant.model.server.js")();

    var models = {
        userModel: userModel,
        reviewModel: reviewModel,
        restaurantModel: restaurantModel
    };

    userModel.setModels(models);
    reviewModel.setModels(models);
    restaurantModel.setModels(models);

    return models;
};