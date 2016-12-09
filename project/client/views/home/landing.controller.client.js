(function () {
    angular
        .module("FoodbookApp")
        .controller("LandingController", LandingController);

    function LandingController(SearchService) {
        var vm = this;

        vm.search = search;
        vm.searchLocation = "";
        vm.searchKeyword = "";

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
                                vm.searchLocation = results[1];
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