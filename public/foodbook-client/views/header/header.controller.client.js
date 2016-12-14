(function () {
    angular
        .module("FoodbookApp")
        .controller("HeaderController", HeaderController);

    function HeaderController($location, $rootScope, UserService) {
        var vm = this;
        vm.logout = logout;

        function init() {
            UserService
                .findCurrentUser()
                .success(function (user) {
                    if(user !== '0'){
                        vm.user = user;
                        vm.userId = user._id;
                        $rootScope.loggedInUser = user.username;
                        $rootScope.loggedInUserId = user._id;
                        $rootScope.foodBooker = user;
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        }
        init();

        function logout() {
            UserService
                .logout()
                .success(function () {
                    $rootScope.loggedInUser = null;
                    $location.url("/");
                })
                .error(function (err) {
                    console.log("Error logging out user");
                    console.log(err);
                });
        }
    }
})();