module.exports = function () {

    var userModel = require("./user/user.model.server")();
    var reviewModel = require("./review/review.model.server")();
    var restaurantModel = require("./restaurant/restaurant.model.server")();

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