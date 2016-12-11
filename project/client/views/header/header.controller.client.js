(function () {
    angular
        .module("FoodbookApp")
        .controller("HeaderController", HeaderController);

    function HeaderController($location, $rootScope, UserService) {
        var vm = this;
        vm.logout = logout;

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