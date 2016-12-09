(function () {
    angular
        .module("FoodbookApp")
        .controller("RestaurantController", RestaurantController);

    function RestaurantController($routeParams, SearchService) {
        var vm = this;
        vm.restaurantId = $routeParams['restaurantId'];

        function init() {
            search(vm.restaurantId);
        }

        init();

        function search(restaurantId) {

            console.log("Restaurant Id " + restaurantId);

            SearchService
                .getRestaurantById(restaurantId)
                .success(function (response) {
                        vm.restaurant = response;
                        console.log(response);
                    }
                )
                .error(function (err) {
                        console.log(err);
                    }
                )
        }
    }
})();