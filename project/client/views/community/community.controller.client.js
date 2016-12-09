(function () {
    angular
        .module("FoodbookApp")
        .controller("CommunityController", CommunityController);

    function CommunityController($location, $rootScope, UserService) {
        var vm = this;

        /*function init() {
            UserService
                .findCurrentUser()
                .success(function (user) {
                    if(user !== '0'){
                        vm.currentUser = user;
                        vm.currentUserId = user._id;
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        }
        init();*/

        vm.currentUser = $rootScope.currentUser;
        vm.currentUserId = vm.currentUser._id;

        vm.addFollowing = addFollowing;
        vm.removeFriend = removeFriend;

        function init() {
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
        init();

        function addFollowing(following) {
            UserService
                .addFollowing(vm.currentUserId, following)
                .then(
                    function (user) {
                        vm.message = following.username + " added as friend!";
                        init();
                    },
                    function(err){
                        vm.error = "Aww Snap! Some error occurred :( Could not follow " + following.username + "user.";
                    }
                )
        }

        function removeFriend(fname){

         /*   UserService.findUserByUsername(fname)
                .then(function(userFriend){

                    UserService.removeFriend($rootScope.currentUser._id,userFriend.data._id)
                        .then(
                            function(remvedList){
                                vm.message= "Removed as friend";
                                var friends = [];
                                friends = $rootScope.currentUser.friends;
                                friends.splice(friends.indexOf(userFriend.data._id),1);

                                var updatedUser = {
                                    username: $rootScope.currentUser.username,
                                    password: $rootScope.currentUser.password,
                                    firstName: $rootScope.currentUser.firstName,
                                    lastName: $rootScope.currentUser.lastName,
                                    email: $rootScope.currentUser.email,
                                    phones: $rootScope.currentUser.phones,
                                    review: $rootScope.currentUser.review,
                                    likes: $rootScope.currentUser.likes,
                                    friends : friends
                                };

                                UserService.updateUser( $rootScope.currentUser._id, updatedUser)
                                    .then(
                                        function (updatedUser){
                                            if (updatedUser.data != null) {
                                                UserService.setUser(updatedUser.data);
                                            }
                                            else
                                            {
                                                vm.message = "Cannot update User";
                                            }
                                        },
                                        function (error){
                                            vm.message = "Cannot update User";
                                        });

                                UserService.findFriends($rootScope.currentUser._id)
                                    .then(function(users){
                                        vm.friends = users.data;
                                    },function(err){

                                    });

                            },function(err){

                            }
                        )

                });*/

        }
    }
})();