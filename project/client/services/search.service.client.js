(function () {
    angular
        .module("FoodbookApp")
        .factory("SearchService", SearchService);

    function SearchService($http){
        var api = {
            getSearchResults : getSearchResults,
            getRestaurantById : getRestaurantById
        };

        return api;

        function getSearchResults(location, keyword) {
            return $http.get("/api/project/search?location=" + location + "&keyword=" + keyword);
        }

        function getRestaurantById(restaurantId) {
            console.log(restaurantId);
            return $http.get("/api/project/search/" + restaurantId);
        }
    }
})();