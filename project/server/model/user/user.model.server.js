module.exports = function () {

    var models = {};
    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server")();
    var UserModel = mongoose.model("UserModel", UserSchema);

    var api = {
        setModels: setModels,

        // User
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        findUserByFacebookId: findUserByFacebookId,
        findUserByGoogleId: findUserByGoogleId,
        updateUser: updateUser,
        deleteUser: deleteUser,

        // Reviews
        findAllReviewsForUser: findAllReviewsForUser,

        // Favorites
        addFavoriteRestaurant: addFavoriteRestaurant,
        findAllFavoritesForUser: findAllFavoritesForUser,
        removeFavoriteRestaurant: removeFavoriteRestaurant,

        // Community
        findAllUsers: findAllUsers,
        findFollowing: findFollowing,
        findFollowers: findFollowers,
        addFollowing: addFollowing,
        removeFollowing: removeFollowing
    };
    return api;

    function createUser(user) {
        return UserModel.create(user);
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function findUserByUsername(username) {
        return UserModel.findOne({username: username});
    }

    function findUserByCredentials(username, password) {
        return UserModel.findOne({username: username, password: password});
    }

    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId});
    }

    function findUserByGoogleId(googleId) {
        return UserModel.findOne({'google.id': googleId});
    }

    function updateUser(userId, user) {
        return UserModel.update(
            {
                _id: userId
            },
            {
                $set: user
            }
        );
    }

    function deleteUser(userId) {
        return UserModel.remove({_id: userId});
    }

    function setModels(_models) {
        models = _models;
    }

    function findAllReviewsForUser(userId) {
        return UserModel
            .findById(userId)
            .populate("reviews")
            .exec();
    }
    
    function addFavoriteRestaurant(userId, restaurant) {
        return new Promise(function (success, err) {
            UserModel
                .findById(userId)
                .then(function (user) {
                    user.favorites.push(restaurant);
                    user.save();
                    success(user);
                }, function (error) {
                    err(error);
                });
        });
    }

    function findAllFavoritesForUser(userId) {
        return UserModel
            .findById(userId)
            .populate("favorites")
            .exec();
    }

    function removeFavoriteRestaurant(userId, restaurantId) {
        return UserModel.update(
            {
                _id: userId
            },
            {
                $pull: {favorites: restaurantId}
            });
    }

    function findAllUsers() {
        return UserModel.find();
    }

    function findFollowing(userId) {
        return UserModel
            .findById(userId)
            .populate("following")
            .exec();
    }

    function findFollowers(userId) {
        return UserModel.find({following: userId});
    }

    function addFollowing(userId, followingId) {
        return new Promise(function (success, err) {
            UserModel
                .findById(userId)
                .then(function (user) {
                    user.following.push(followingId);
                    user.save();
                    success(user);
                }, function (error) {
                    err(error);
                });
        });
    }

    function removeFollowing(userId, followingId) {
        return UserModel.update(
            {
                _id: userId
            },
            {
                $pull: {following: followingId}
            });
    }
};