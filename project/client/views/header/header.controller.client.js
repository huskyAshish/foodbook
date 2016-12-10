(function() {
    angular
        .module("FoodbookApp")
        .controller("HeaderController", HeaderController);

    function HeaderController($scope, $location, $routeParams, UserService) {

        var vm = this;
        //vm.checkRestaurantPage = checkRestaurantPage;
        vm.updateRestaurantPage = updateRestaurantPage;

        /*function checkRestaurantPage() {
            //console.log($location.path());
            vm.isSearchPage = (viewLocation === $location.path());
        }*/

        function updateRestaurantPage(isRestaurantPage) {
            vm.isRestaurantPage = isRestaurantPage;
        }

        /*function init() {
            vm.checkRestaurantPage();
        }*/

        init();
    }
})();
        /*vm.logout = logout;

        function init() {
            vm.$location = $location;
        }
        init();

        function logout() {
            UserService
                .logout()
                .then(function(user){
                        console.log("logout success");
                        UserService.setUser(null);
                        console.log($rootScope.currentUser);
                        $location.url("/");
                    },
                    function(err){
                        console.log("logout error");
                    });
        }
    }
})();*/