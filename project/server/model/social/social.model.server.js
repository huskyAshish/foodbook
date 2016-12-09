module.exports = function () {

    var models = {};
    var mongoose = require("mongoose");
    var SocialSchema = require("./social.schema.server")();
    var Social = mongoose.model("Social", SocialSchema);

    var api = {
        setModels: setModels,
        addFriend: addFriend,
        findFriends: findFriends,
        findFollowers: findFollowers,
        removeFriend: removeFriend
    };
    return api;

    function setModels(_models) {
        models = _models;
    }

    function addFriend(userId, username, friend) {
        Social.create(
            {
                userId : userId,
                username : username,
                followerId  : friend._id,
                followerName : friend.username
            }
        );
    }

    function removeFriend(userId, friendId) {
        Social.findOneAndRemove(
            {
                $and : [{ 'userId' : userId },
                        { 'followerId' : friendId }]
            }
        );
    }

    function findFriends(userId) {
        Social.find({ userId : userId });
    }

    function findFollowers(userId) {
        FollowModel.find({ followerId : userId });
    }
};