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
            .when("/user/:uid", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/user", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/social", {
                templateUrl: "views/social/social.view.client.html",
                controller: "SocialController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
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
                        $rootScope.currentUser = user;
                        deferred.resolve();
                    } else {
                        deferred.reject();
                        $location.url("/login");
                    }
                });
            return deferred.promise;
        }
    }
})();