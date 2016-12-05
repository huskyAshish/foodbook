module.exports = function(app) {
    var Models = require("./model/model.server")();
    require("./services/user.service.server")(app, Models);
    require("./services/search.service.server")(app, Models);
};

