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
            updateUser : updateUser,
            deleteUser : deleteUser,
            login: login,
            logout: logout,
            checkLoggedin: checkLoggedin,
            register: register,
            findCurrentUser: findCurrentUser
        };

        return api;

        function  createUser(_user) {
            var url = '/api/user';
            var user = _user;
            return $http.post(url, user);
        }

        function  findUserById(userId) {
            var url = '/api/user/' + userId;
            return $http.get(url);
        }

        function  findUserByUsername(username) {
            var url = '/api/user?username=' + username;
            return $http.get(url);
        }

        function  findUserByCredentials(username, password) {
            var url = '/api/user?username=' + username + "&password=" + password;
            return $http.get(url);
        }

        function  updateUser(userId, user) {
            var url = '/api/user/' + userId;
            return $http.put(url, user);
        }

        function  deleteUser(userId) {
            var url = '/api/user/' + userId;
            return $http.delete(url);
        }

        function login(user) {
            return $http.post("/api/login", user);
        }

        function logout() {
            return $http.post("/api/logout");
        }

        function checkLoggedin() {
            return $http.post("/api/loggedin");
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        function findCurrentUser() {
            return $http.get("/api/user");
        }
    }

})();