(function () {
    angular
        .module("FoodbookApp")
        .controller("LandingController", LandingController);

    function LandingController($scope, SearchService) {
        var vm = this;
        $scope.cuisines = null;
        $scope.loadCuisines = loadCuisines;
        $scope.locations = null;
        $scope.loadLocations = loadLocations;

        vm.search = search;

        function loadCuisines() {
            $scope.cuisines =  $scope.cuisines  || [
                            { id: 1, name: 'Italian' },
                            { id: 2, name: 'Mexican' },
                            { id: 3, name: 'Indian' },
                            { id: 4, name: 'Thai' },
                            { id: 5, name: 'American' },
                            { id: 6, name: 'Turkish' },
                            { id: 7, name: 'Chinese' }
                        ];
        };

        function loadLocations() {
            $scope.locations =  $scope.locations  || [
                    { id: 1, name: 'Boston' },
                    { id: 2, name: 'Chicago' },
                    { id: 3, name: 'Austin' },
                    { id: 4, name: 'New York' },
                    { id: 5, name: 'San Francisco' },
                    { id: 6, name: 'Los Angeles' },
                    { id: 7, name: 'Seattle' }
                ];
        };

        function search(keyword) {

            var chosenCuisine = $scope.cuisine == null ? null : $scope.cuisine.name;
            var chosenLocation = $scope.location == null ? null : $scope.location.name;

            console.log("Cuisine " + chosenCuisine + ", Location " + chosenLocation + ", Keyword: " + keyword);

            SearchService
                .getSearchResults(chosenCuisine, chosenLocation, keyword)
                .success(function (response) {
                        vm.restaurants = response;
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