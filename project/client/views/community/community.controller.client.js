(function () {
    angular
        .module("FoodbookApp")
        .controller("CommunityController", CommunityController);

    function CommunityController(UserService) {
        var vm = this;

        vm.addFollowing = addFollowing;
        vm.removeFriend = removeFriend;

        function init() {

            UserService
                .findCurrentUser()
                .success(function (user) {
                    if(user !== '0'){
                        vm.currentUser = user;
                        vm.currentUserId = user._id;

                        UserService
                            .findSuggestedUsers(vm.currentUserId)
                            .then(
                                function (users) {
                                    vm.suggestedUsers = users.data;
                                },
                                function (err) {
                                    console.log(err);
                                });

                        UserService
                            .findFollowing(vm.currentUserId)
                            .then(
                                function (following) {
                                    vm.following = following.data;
                                },
                                function (err) {
                                    console.log(err);
                                });

                        UserService
                            .findFollowers(vm.currentUserId)
                            .then(
                                function (followers) {
                                    vm.followers = followers.data;
                                },
                                function (err) {
                                    console.log(err);
                                });
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        }
        init();

        function addFollowing(following) {
            UserService
                .addFollowing(vm.currentUserId, following)
                .then(
                    function (user) {
                        vm.message = "Started following: " + following.username;
                        init();
                    },
                    function(err){
                        vm.error = "Aww Snap! Some error occurred :( Could not follow " + following.username + "user."
                        console.log(err);
                    }
                );
        }

        function removeFriend(following){
            UserService
                .removeFollowing(vm.currentUserId, following._id)
                .then(
                    function (user) {
                        vm.message = "Stopped following: " + following.username;
                        init();
                    },
                    function (err) {
                        vm.error = "Aww Snap! Some error occurred :( Couldn't stop following " + following.username + "user."
                        console.log(err);
                    }
                );
        }
    }
})();