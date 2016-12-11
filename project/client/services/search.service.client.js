(function () {
    angular
        .module("FoodbookApp")
        .factory("SearchService", SearchService);

    function SearchService($http){
        var api = {
            getSearchResults : getSearchResults,
            getRestaurantById : getRestaurantById,
         //   findCurrentUser : findCurrentUser,
            createRestaurant: createRestaurant,
            createReviewForRestaurant: createReviewForRestaurant
          //  findAllReviewsForRestaurant: findAllReviewsForRestaurant,
        };

        return api;

        function getSearchResults(location, keyword) {
            return $http.get("/api/project/search?location=" + location + "&keyword=" + keyword);
        }

        function getRestaurantById(restaurantId) {
            console.log(restaurantId);
            return $http.get("/api/project/search/" + restaurantId);
        }

        function createRestaurant(_restaurant) {
            var url = "/api/foodbook/restaurant";
            var restaurant = _restaurant;
            return $http.post(url, restaurant);
        }
        
        function createReviewForRestaurant(_review, _restaurant) {
            var url = "/api/foodbook/restaurant/" + _restaurant._id + "/review";
            var body = {
                restaurant : _restaurant,
                review: _review
            };
            return $http.post(url, body);
        }
    }
})();