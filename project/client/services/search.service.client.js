(function () {
    angular
        .module("FoodbookApp")
        .factory("SearchService", SearchService);

    function SearchService($http){

        var api = {
            getSearchResults : getSearchResults
        };

        return api;

        function getSearchResults(cuisine, location, keyword) {
            return $http.get("/api/project/search?cuisine="+cuisine+"&location="+location+"&keyword="+keyword);
        }

    }

})();