(function () {
    angular
        .module("FoodbookApp")
        .controller("RestaurantController", RestaurantController);

    function RestaurantController($routeParams, $location, SearchService, UserService) {
        var vm = this;
        vm.search = search;
        vm.updateFavorite = updateFavorite;
        vm.createReview = createReview;
        vm.reviews = [];
        vm.restaurantId = $routeParams['restaurantId'];
        vm.loc = $routeParams['loc'];
        vm.key = $routeParams['key'];
        
        function init() {
            UserService
                .findCurrentUser()
                .success(function (user) {
                    if (user !== '0' && user !== "") {
                        vm.currentUser = user;
                        vm.currentUserId = user._id;
                        vm.isFavorite = (vm.currentUser.favorites.indexOf(vm.restaurantId) == -1) ? 'false' : 'true';
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
            search(vm.restaurantId);
            vm.isDetailsPage = true;

            SearchService
                .findAllReviewsForRestaurant(vm.restaurantId)
                .success(function (reviews) {
                    vm.reviews = reviews;
                })
                .error (function(err) {
                        console.log(err);
                    }
                );
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
                            swal("Yayy!", "You have a new favorite!", "success")
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
                            swal("Sorry!", "We are sorry that you lost a favorite!", "success")
                        },
                        function (err) {
                            console.log(err);
                        }
                    );
            }
        }
        
        function createReview(review) {

            var _restaurant = {
                _id: vm.restaurant.id,
                name: vm.restaurant.name,
                location: vm.restaurant.location.city,
                image: vm.restaurant.image_url,
                rating: vm.restaurant.rating
                // reviews
            }
            review._user = vm.currentUser;
            review._restaurant = _restaurant;
            SearchService
                .createReviewForRestaurant(review, _restaurant)
                .then(
                    function (newReview) {
                        vm.reviews.push(newReview.data);
                        swal("Congratulations!", "You successfully submitted review!", success);
                    },
                    function (error) {
                        console.log(error);
                    }
                )
        }
    }
})();