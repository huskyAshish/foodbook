(function () {
    angular
        .module("FoodbookApp")
        .config(Config);

    function  Config($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "views/home/landing.view.client.html",
                controller: "LandingController",
                controllerAs: "model"
            })
            .when("/home/loc/:loc/key/:key", {
                templateUrl: "views/home/landing.view.client.html",
                controller: "LandingController",
                controllerAs: "model"
            })
            .when("/home/loc/:loc", {
                templateUrl: "views/home/landing.view.client.html",
                controller: "LandingController",
                controllerAs: "model"
            })
            .when("/restaurant/:restaurantId/loc/:loc", {
                templateUrl: "views/restaurant/restaurant.view.client.html",
                controller: "RestaurantController",
                controllerAs: "model"
            })
            .when("/restaurant/:restaurantId/loc/:loc/key/:key", {
                templateUrl: "views/restaurant/restaurant.view.client.html",
                controller: "RestaurantController",
                controllerAs: "model"
            })
            .when("/restaurant/:restaurantId/:page/:dest", {
                templateUrl: "views/restaurant/restaurant.view.client.html",
                controller: "RestaurantController",
                controllerAs: "model"
            })
            .when("/login", {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/user/reviews", {
                templateUrl: "views/user/reviews.view.client.html",
                controller: "ReviewController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/user/favorites", {
                templateUrl: "views/user/favorites.view.client.html",
                controller: "FavoritesController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/user/edit", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/user/:uid", {
                templateUrl: "views/user/public-profile.view.client.html",
                controller: "PublicProfileController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/user/profile/:uid", {
                templateUrl: "views/user/public-profile.view.client.html",
                controller: "PublicProfileController",
                controllerAs: "model",
                //resolve: {
                //    loggedin: checkLoggedin
                //}
            })
            .when("/community", {
                templateUrl: "views/community/community.view.client.html",
                controller: "CommunityController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/admin", {
                templateUrl: "views/user/admin.view.client.html",
                controller: "AdminController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkAdminLoggedin
                }
            })
            .otherwise({
                redirectTo: "/home"
            });

        function checkLoggedin($q, UserService, $location, $rootScope) {
            var deferred = $q.defer();
            UserService
                .checkLoggedin()
                .success(function (user) {
                    if(user != '0') {
                        $rootScope.loggedInUser = user.username;
                        $rootScope.loggedInUserId = user._id;
                        $rootScope.foodBooker = user;
                        deferred.resolve();
                    } else {
                        $rootScope.loggedInUser = null;
                        deferred.reject();
                        $location.url("/login");
                    }
                });
            return deferred.promise;
        }

        function checkAdminLoggedin($q, UserService, $location, $rootScope) {
            var deferred = $q.defer();
            UserService
                .checkLoggedin()
                .success(function (user) {
                    if(user != '0' && user.role === 'ADMIN') {
                        $rootScope.loggedInUser = user.username;
                        $rootScope.loggedInUserId = user._id;
                        $rootScope.foodBooker = user;
                        deferred.resolve();
                    } else {
                        $rootScope.loggedInUser = null;
                        deferred.reject();
                        $location.url("/login");
                    }
                });
            return deferred.promise;
        }
    }
})();