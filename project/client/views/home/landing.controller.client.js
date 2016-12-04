(function () {
    angular
        .module("FoodbookApp")
        .controller("LandingController", LandingController);

    function LandingController() {
        var vm = this;
        vm.selectCuisine = selectCuisine;
        vm.selectLocation = selectLocation;

        function init() {
            vm.cuisine = 'Cuisine';
            vm.location = 'Location';
        }
        init();

        function selectCuisine(_cuisine) {
            vm.cuisine = _cuisine;
        }

        function selectLocation(_location) {
            vm.location = _location;
        }
    }

})();