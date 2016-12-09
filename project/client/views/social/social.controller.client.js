(function () {
    angular
        .module("FoodbookApp")
        .controller("SocialController", SocialController);

    function SocialController($location, $rootScope, UserService) {
        var vm = this;

        vm.currentUser = $rootScope.currentUser;
        vm.currentUserId = vm.currentUser._id;

        vm.isCurrentUser = isCurrentUser;
        vm.isFriend = isFriend;
   //     vm.addFriend = addFriend;
    //    vm.removeFriend = removeFriend;

        function init() {
            UserService
                .findAllUsers()
                .then(
                    function (users) {
                        vm.allUsers = users.data;
                    },
                    function (err) {
                        console.log(err);
                    });

            UserService
                .findFriends(vm.currentUserId)
                .then(
                    function (friends) {
                        vm.friends = friends.data;
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

        function isCurrentUser(username) {
            if (vm.currentUser && vm.currentUser.username === username) {
                return true;
            }
            return false;
        }

        function isFriend(user) {
            if (vm.currentUser && vm.currentUser.friends.length > 0) {
                if(vm.currentUser.friends.indexOf(user._id) != -1){
                    return true;
                }
            }
            return false;
        }

    /*    function addFriend(friend) {
            UserService
                .addFriend(vm.currentUserId, vm.currentUser.username, friend)
                .then(
                    function (userFriend) {
                        vm.message= userFriend.username + " added as friend!";
                        var friends = [];
                        friends = $rootScope.currentUser.friends;
                        friends.push(userFriend.data.followerId);

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
        }

        function removeFriend(fname){

            UserService.findUserByUsername(fname)
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

                });

        }*/

    }
})();