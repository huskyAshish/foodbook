module.exports = function () {

    var models = {};
    var mongoose = require("mongoose");
    var RestaurantSchema = require("./restaurant.schema.server.js")();
    var RestaurantModel = mongoose.model("RestaurantModel", RestaurantSchema);

    var api = {
        setModels: setModels,
        createRestaurant: createRestaurant,
        findRestaurantById: findRestauantById,
        updateRestaurant: updateRestaurant,
        deleteRestaurant: deleteRestaurant
    };
    return api;

    function setModels(_models) {
        models = _models;
    }

    function createRestaurant(restaurant) {
        return RestaurantModel.create(restaurant);
    }

    function findRestauantById(restaurantId) {
        return RestaurantModel.findById(restaurantId);
    }

    function updateRestaurant(restaurantId, restaurant) {
        return RestaurantModel.update(
            {
                _id: restaurantId
            },
            {
                $set: restaurant
            }
        );
    }

    function deleteRestaurant(restaurantId) {
        return RestaurantModel.remove({_id: restaurantId});
    }
};