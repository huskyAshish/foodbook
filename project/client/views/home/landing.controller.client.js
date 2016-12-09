(function () {
    angular
        .module("FoodbookApp")
        .controller("LandingController", LandingController);

    function LandingController(SearchService) {
        var vm = this;

        vm.search = search;
        vm.searchLocation = "";
        vm.searchKeyword = "";

        var input = document.getElementById('location');
        var autocomplete = new google.maps.places.Autocomplete(input);

        autocomplete.addListener('place_changed', function () {
            vm.searchLocation = autocomplete.getPlace();
        });

        function search() {
            SearchService
                .getSearchResults(vm.searchLocation.formatted_address, vm.searchKeyword)
                .success(function (response) {
                        vm.restaurants = response;
                    }
                )
                .error(function (err) {
                        console.log(err);
                    }
                )
        }
    }
})();