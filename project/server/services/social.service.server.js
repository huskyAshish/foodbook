module.exports = function(app, models) {

    app.post("/api/project/:userId/follow/:username", addFriend);
    app.get("/api/project/find/friends/:userId", findFriends);
    app.get("/api/project/find/followers/:userId", findFollowers);
    app.delete("/api/project/:userId/friend/:friendId", removeFriend);

    function addFriend(req, res) {
        var userId = req.params.userId;
        var username = req.params.username;
        var friend = req.body;

        models
            .socialModel
            .addFriend(userId, username, friend)
            .then(
                function (newFollower) {
                    res.send(newFollower);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function findFriends(req, res) {
        var userId = req.params.userId;
        models
            .socialModel
            .findFriends(userId)
            .then(
                function (friends) {
                    res.send(friends);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function findFollowers(req, res) {
        var userId = req.params.userId;
        models
            .socialModel
            .findFollowers(userId)
            .then(
                function (followers) {
                    res.send(followers);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function removeFriend(req, res) {
        var userId = req.params.userId;
        var friendId = req.params.friendId;

        models
            .socialModel
            .removeFriend(userId, friendId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }
};