module.exports = function () {

    var userModel = require("./user/user.model.server")();

    var models = {
        userModel: userModel
    };

    userModel.setModels(models);
    return models;
};