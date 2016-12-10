(function () {
    angular
        .module("FoodbookApp")
        .controller("RestaurantController", RestaurantController);

    function RestaurantController($routeParams, SearchService, UserService) {
        var vm = this;
        vm.search = search;
        vm.updateFavorite = updateFavorite;
        vm.restaurantId = $routeParams['restaurantId'];

        function init() {
            UserService
                .findCurrentUser()
                .success(function (user) {
                    if (user !== '0' && user !== "") {
                        vm.currentUser = user;
                        vm.currentUserId = user._id;
                        vm.isFavorite = vm.currentUser.favorites.indexOf(vm.restaurantId) == -1 ? 'false' : 'true';
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
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
        
        function updateFavorite(_restaurant) {
            if (vm.isFavorite == 'false') {
                var newRestaurant = {
                    _id: _restaurant.id,
                    name: _restaurant.name,
                    location: _restaurant.location.city,
                    image: _restaurant.image_url,
                    rating: _restaurant.rating
                    // reviews
                }

                UserService
                    .addFavoriteRestaurant(vm.currentUserId, newRestaurant)
                    .then(
                        function (restaurant) {
                            vm.isFavorite = 'true';
                            alert("Favorite added");
                        },
                        function(err){
                            console.log(err);
                        }
                    );
            } else {
                UserService
                    .removeFavoriteRestaurant(vm.currentUserId, _restaurant.id)
                    .then(
                        function (user) {
                            vm.isFavorite = 'false';
                            alert("Removed from favorites");
                        },
                        function (err) {
                            console.log(err);
                        }
                    );
            }
        }
    }
})();