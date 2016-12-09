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
            findCurrentUser: findCurrentUser,
            findAllUsers: findAllUsers
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
        
        function findAllUsers() {
            
        }
    }

})();