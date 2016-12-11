(function () {
    angular
        .module("FoodbookApp")
        .controller("LandingController", LandingController);

    function LandingController(SearchService, $routeParams, $rootScope) {
        var vm = this;

        vm.search = search;
        vm.searchLocation = $routeParams.loc;
        vm.searchKeyword = $routeParams.key;

        var loc = $routeParams.loc;
        var key = $routeParams.key;

        function init() {

            if(loc && key){
                /*console.log("Came back and searching by " + loc + "," + key);
                SearchService
                    .getSearchResults(loc, key)
                    .success(function (response) {
                            vm.restaurants = response;
                        }
                    )
                    .error(function (err) {
                            console.log(err);
                        }
                    )*/
            }else{
                var lat = "";
                var lng = "";

                // Converts Geo-location into the current location.
                if(!navigator.geolocation){
                    console.log("Browser geo-location not allowed!!");
                }else{
                    navigator.geolocation.getCurrentPosition(function (position) {
                            lat = position.coords.latitude;
                            lng = position.coords.longitude;

                            var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
                            var geocoder = new google.maps.Geocoder;
                            geocoder.geocode({'location': latlng}, function(results, status) {
                                if (status === 'OK') {
                                    if (results[1]) {
                                        if (vm.searchLocation == undefined || vm.searchLocation == null || vm.searchLocation == "") {
                                            vm.searchLocation = results[1].formatted_address;
                                            vm.search();
                                        }
                                    } else {
                                        window.alert('No results found');
                                    }
                                } else {
                                    window.alert('Geocoder failed due to: ' + status);
                                }
                            });

                        }, function(){
                            $rootScope.apiResponse = 1;
                            $rootScope.$apply();
                        },{maximumAge:0,enableHighAccuracy:true}
                    );
                }

                // Manually entered location can override the geolocation.

                var input = document.getElementById('location');
                var autocomplete = new google.maps.places.Autocomplete(input);

                autocomplete.addListener('place_changed', function () {
                    vm.searchLocation = autocomplete.getPlace().formatted_address;
                    vm.search();
                });
            }
            if (!(vm.searchLocation == undefined || vm.searchLocation == null || vm.searchLocation == "")) {
                vm.search();
            }
        }

        init();

        function search() {
            SearchService
                .getSearchResults(vm.searchLocation, vm.searchKeyword)
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