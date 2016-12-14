(function () {
    angular
        .module("FoodbookApp")
        .factory("UserService", UserService);

    function UserService($http){

        var api = {
            createUser : createUser,
            findUserById : findUserById,
            findUserByUsername : findUserByUsername,
            findUserByCredentials : findUserByCredentials,
            findUsersByKey: findUsersByKey,
            updateUser : updateUser,
            deleteUser : deleteUser,
            login: login,
            logout: logout,
            checkLoggedin: checkLoggedin,
            register: register,
            findCurrentUser: findCurrentUser,
            addFollowing: addFollowing,
            findFollowing: findFollowing,
            findFollowers: findFollowers,
            removeFollowing: removeFollowing,
            findSuggestedUsers: findSuggestedUsers,
            addFavoriteRestaurant: addFavoriteRestaurant,
            removeFavoriteRestaurant: removeFavoriteRestaurant,
            findAllFavoritesForUser: findAllFavoritesForUser,
            findAllReviewsForUser: findAllReviewsForUser
        };

        return api;

        function  createUser(_user) {
            var url = '/api/foodbook/user';
            var user = _user;
            return $http.post(url, user);
        }

        function  findUserById(userId) {
            var url = '/api/foodbook/user/' + userId;
            return $http.get(url);
        }

        function  findUserByUsername(username) {
            var url = '/api/foodbook/user?username=' + username;
            return $http.get(url);
        }

        function  findUserByCredentials(username, password) {
            var url = '/api/foodbook/user?username=' + username + "&password=" + password;
            return $http.get(url);
        }

        function findUsersByKey(usernameKey) {
            var url = '/api/foodbook/admin/search?usernamekey=' + usernameKey;
            return $http.get(url);
        }

        function  updateUser(userId, user) {
            var url = '/api/foodbook/user/' + userId;
            return $http.put(url, user);
        }

        function  deleteUser(userId) {
            var url = '/api/foodbook/user/' + userId;
            return $http.delete(url);
        }

        function login(user) {
            return $http.post("/api/foodbook/login", user);
        }

        function logout() {
            return $http.post("/api/foodbook/logout");
        }

        function checkLoggedin() {
            return $http.post("/api/foodbook/loggedin");
        }

        function register(user) {
            return $http.post("/api/foodbook/register", user);
        }

        function findCurrentUser() {
            return $http.get("/api/foodbook/user");
        }

        function addFollowing(userId, _following) {
            var url = "/api/foodbook/user/" + userId + "/community";
            var following = _following;
            return $http.post(url, following);
        }

        function findFollowing(userId) {
            var url = "/api/foodbook/user/" + userId + "/following";
            return $http.get(url);
        }

        function findFollowers(userId) {
            var url = "/api/foodbook/user/" + userId + "/followers";
            return $http.get(url);
        }

        function findSuggestedUsers(userId) {
            var url = "/api/foodbook/user/" + userId + "/community";
            return $http.get(url);
        }

        function  removeFollowing(userId, followingId) {
            var url = "/api/foodbook/user/" + userId + "/following/" + followingId;
            return $http.delete(url);
        }

        function addFavoriteRestaurant(userId, restaurant) {
            var url = "/api/foodbook/user/" + userId + "/fav/new";
            return $http.post(url, restaurant);
        }
        
        function removeFavoriteRestaurant(userId, restaurantId) {
            var url = "/api/foodbook/user/" + userId + "/fav/" + restaurantId;
            return $http.delete(url);
        }

        function findAllFavoritesForUser(userId) {
            var url = "/api/foodbook/user/" + userId + "/fav";
            return $http.get(url);
        }
        
        function findAllReviewsForUser(userId) {
            var url = "/api/foodbook/user/" + userId + "/review";
            return $http.get(url);
        }
    }
})();