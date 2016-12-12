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
                vm.error = "Please enter username and password.";
                return;
            }

            UserService
                .login(user)
                .success(function (user) {
                    if (user === '0') {
                        vm.error = "Unable to login!";
                    } else {
                        $location.url("/user");
                    }
                })
                .error(function (error) {
                    if (error == "Unauthorized") {
                        vm.error = "Invalid username and password combination";
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
                vm.error = "Enter valid username!";
                return;
            } else if (!user.password) {
                vm.error = "Enter valid password!";
                return;
            } else {
                if (user.password === user.verify) {
                    UserService
                        .register(user)
                        .success(function (user) {
                            $location.url("/user");
                        })
                        .error(function (error) {
                            console.log(error);
                        });

                } else {
                    vm.error = "Passwords do not match!";
                    return;
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
                UserService.updateUser(vm.userId, user);
            } else {
                vm.error = "Username cannot be empty!";
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
                    console.log("Error logging out user");
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
                        vm.users = response;
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

        if (!vm.userId || vm.userId == "") {
            UserService
                .findCurrentUser()
                .success(function (user) {
                    if(user !== '0'){
                        vm.userId = user._id;
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        }

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
        }
        init();
    }
})();