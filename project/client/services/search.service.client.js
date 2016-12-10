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
            var url = '/api/foodbook/restaurant';
            var restaurant = _restaurant;
            return $http.post(url, restaurant);
        }
    }
})();