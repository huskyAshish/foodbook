(function () {
    angular
        .module("FoodbookApp")
        .controller("RestaurantController", RestaurantController);

    function RestaurantController($routeParams, SearchService) {
        var vm = this;
        vm.restaurantId = $routeParams['restaurantId'];
        vm.loc = $routeParams['loc'];
        vm.key = $routeParams['key'];

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
                        vm.restaurant.image_url = vm.restaurant.image_url.replace("ms.jpg", "o.jpg");
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