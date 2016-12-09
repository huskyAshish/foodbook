module.exports = function () {

    var userModel = require("./user/user.model.server")();
    var socialModel = require("./social/social.model.server")();

    var models = {
        userModel: userModel,
        socialModel: socialModel
    };

    userModel.setModels(models);
    socialModel.setModels(models);

    return models;
};