module.exports = function(app) {
    var Models = require("./model/model.server.js")();
    require("./services/user.service.server.js")(app, Models);
    require("./services/search.service.server.js")(app, Models);
    require("./services/review.service.server.js")(app, Models);
};

