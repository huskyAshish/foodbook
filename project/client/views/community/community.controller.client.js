(function () {
    angular
        .module("FoodbookApp")
        .controller("CommunityController", CommunityController);

    function CommunityController(UserService) {
        var vm = this;

        vm.addFollowing = addFollowing;
        vm.removeFollowing = removeFollowing;

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
                        swal({
                            title: "Yippee!",
                            text: "You are now following " + (following.firstName ? following.firstName : following.username) + "! <i class='fa fa-smile-o'></i>",
                            html: true
                         });
                        init();
                    },
                    function(err){
                        swal({
                            title: "Aww Snap!",
                            text: "Some error occurred. Could not follow " + (following.firstName ? following.firstName : following.username) + ". <i class='fa fa-frown-o'></i>",
                            html: true
                        });
                        console.log(err);
                    }
                );
        }

        function removeFollowing(following){
            UserService
                .removeFollowing(vm.currentUserId, following._id)
                .then(
                    function (user) {
                        swal({
                            title: "No more a follower!",
                            text: "You have unfollowed " + (following.firstName ? following.firstName : following.username) + "! <i class='fa fa-frown-o'></i>",
                            html: true
                        });
                        init();
                    },
                    function (err) {
                        swal({
                            title: "Aww Snap!",
                            text: "Some error occurred. Could not stop following " + (following.firstName ? following.firstName : following.username) + ". <i class='fa fa-frown-o'></i>",
                            html: true
                        });
                        console.log(err);
                    }
                );
        }
    }
})();