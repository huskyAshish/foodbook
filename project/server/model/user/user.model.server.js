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

        // Admin
        findUsersByKey: findUsersByKey,

        // Reviews
        findAllReviewsForUser: findAllReviewsForUser,

        // Favorites
        addFavoriteRestaurant: addFavoriteRestaurant,
        findAllFavoritesForUser: findAllFavoritesForUser,
        removeFavoriteRestaurant: removeFavoriteRestaurant,

        // Community
        findSuggestedUsers: findSuggestedUsers,
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
                    console.log(restaurant);
                   // restaurant.save();
                    console.log(user.favorites);
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

    function findSuggestedUsers(userId) {
        return new Promise(function (success, err) {
            UserModel
                .findById(userId)
                .then(
                    function (user) {
                        UserModel
                            .find({ $and: [ { _id: { $ne: userId } }, { _id: { $nin: user.following } } ] })
                            .then(
                                function (users) {
                                    success(users);
                                }, function (error) {
                                    err(error);
                                }
                            )
                    }, function (error) {
                        err(error);
                    }
                );
            }
        );
    }

    function findUsersByKey(usernameKey) {
        return UserModel.find({username: new RegExp(usernameKey, 'i')});
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

    function addFollowing(userId, following) {
        return new Promise(function (success, err) {
            UserModel
                .findById(userId)
                .then(function (user) {
                    user.following.push(following);
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