(function () {
    angular
        .module("FoodbookApp")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController)
        .controller("ReviewController", ReviewController)
        .controller("AdminController", AdminController)
        .controller("FavoritesController", FavoritesController)
        .controller("PublicProfileController", PublicProfileController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(user) {
            if (!(user && user.username && user.password)) {
                swal("Oops..", "Please enter valid username and password.", "error");
                return;
            }

            UserService
                .login(user)
                .success(function (user) {
                    if (user === '0') {
                        swal("Oops..", "Login failed. Please try again.", "error");
                    } else {
                        $location.url("/user/" + user._id);
                    }
                })
                .error(function (error) {
                    if (error == "Unauthorized") {
                        swal("Login failed", "Invalid username and password combination.", "error");
                    }
                    console.log(error);
                });
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(user) {
            if (!(user && user.username)) {
                swal("Oops..", "Please enter a valid username.", "error");
            } else if (!user.password) {
                swal("Oops..", "Please enter a valid password.", "error");
            } else {
                if (user.password === user.verify) {
                    UserService
                        .register(user)
                        .success(function (user) {
                            $location.url("/user/edit");
                        })
                        .error(function (error) {
                            if(error == "User exists"){
                                swal("Sorry!", "Username '" + user.username + "' is already taken.", "error");
                                vm.user.username = "";
                                vm.user.password = "";
                                vm.user.verify = "";
                            }
                        });

                } else {
                    swal("Uh ho!", "Password and verify password do not match.", "error");
                }
            }
        }
    }

    function ProfileController($location, UserService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        function init() {
            UserService
                .findCurrentUser()
                .success(function (user) {
                    if(user !== '0'){
                        vm.user = user;
                        vm.userId = user._id;
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        }
        init();

        function updateUser(user) {
            if (user.username) {
                UserService
                    .updateUser(vm.userId, user)
                    .then(
                        function (status) {
                            swal({
                                title: "Details Updated!",
                                text: "You will now be redirected to your public profile.",
                                type: "success",
                                timer: 1500,
                                showConfirmButton: false
                           //     confirmButtonColor: "#1995DC",
                           //     confirmButtonText: "Proceed to public profile"
                            });
                            $location.url("/user/" + vm.userId);
                        },
                        function (err) {
                            swal("Oops..", "Update failed. Please try again.", "error");
                        }
                    );
            } else {
                swal("Oops..", "Please enter a valid username.", "error");
            }
        }

        function logout() {
            UserService
                .logout()
                .success(function () {
                    $rootScope.loggedInUser = null;
                    $location.url("/login");
                })
                .error(function (err) {
                    swal("Oops..", "Error logging out. Please try again.", "error");
                    console.log(err);
                });
        }

        function deleteUser() {
            UserService
                .deleteUser(vm.userId)
                .success(function () {
                    $location.url("/login");
                })
                .error(function (error) {
                    swal("Oops..", "De-register failed. Please try again.", "error");
                    console.error(error);
                });
        }
    }

    function ReviewController(UserService) {
        var vm = this;

        function init() {
            UserService
                .findCurrentUser()
                .success(function (user) {
                    if(user !== '0'){
                        vm.user = user;
                        vm.userId = user._id;
                        UserService
                            .findAllReviewsForUser(vm.userId)
                            .success(function (reviews) {
                                vm.reviews = reviews;
                            })
                            .error(function (err) {
                                console.log(err);
                            });
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        }
        init();
    }

    function AdminController(UserService) {
        var vm = this;
        vm.deleteUserByUsername = deleteUserByUsername;
        vm.searchByUsernameKey = searchByUsernameKey;

        function searchByUsernameKey(usernameKey) {
            UserService
                .findUsersByKey(usernameKey)
                .success(function (response) {
                        vm.users = [];
                        for (var u in response) {
                            if (response[u].role != "ADMIN") {
                                vm.users.push(response[u]);
                            }
                        }
                    }
                )
                .error(function (err) {
                        console.log(err);
                    }
                )
        }

        function deleteUserByUsername(user) {
            UserService
                .deleteUser(user._id)
                .success(function () {
                    vm.users.splice(vm.users.indexOf(user), 1);
                })
                .error(function (error) {
                    console.error(error);
                });
        }
    }
    
    function FavoritesController(UserService) {
        var vm = this;

        function init() {

            UserService
                .findCurrentUser()
                .success(function (user) {
                    if(user !== '0'){
                        vm.currentUser = user;
                        vm.currentUserId = user._id;

                        UserService
                            .findAllFavoritesForUser(vm.currentUserId)
                            .success(function (favorites) {
                                vm.favorites = favorites;
                            })
                            .error(function (err) {
                                console.log(err);
                            });
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        }
        init();
    }

    function PublicProfileController($routeParams, UserService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.addFollowing = addFollowing;
        vm.removeFollowing = removeFollowing;

        function init() {

            UserService
                .findUserById(vm.userId)
                .success(function (user) {
                    if (user !== '0') {
                        vm.user = user;
                        UserService
                            .findAllReviewsForUser(vm.userId)
                            .success(function (reviews) {
                                vm.reviews = reviews;
                            })
                            .error(function (err) {
                                console.log(err);
                            });
                        UserService
                            .findAllFavoritesForUser(vm.userId)
                            .success(function (favorites) {
                                vm.favorites = favorites;
                            })
                            .error(function (err) {
                                console.log(err);
                            });
                    }
                })
                .error(function (error) {
                    console.log(error);
                });

            UserService
                .findCurrentUser()
                .success(function (currentUser) {
                    if (currentUser && currentUser != "" && currentUser._id != vm.userId) {
                        vm.followId = vm.userId;
                        vm.removeId = null;
                        vm.currentUserId = currentUser._id;

                        for (var f in currentUser.following) {
                            if (currentUser.following[f] == vm.followId) {
                                vm.removeId = vm.followId;
                                vm.followId = null;
                                break;
                            }
                        }
                    }
                })
                .error(function (err) {
                    console.log(err);
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