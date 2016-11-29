(function () {
    angular
        .module("FoodbookApp")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(user) {

            if(user == null)
                vm.error = "Please enter username and password!"

            UserService
                .findUserByCredentials(user.username, user.password)
                .success(function(user){
                    if(user === '0') {
                        vm.error = "Unable to login!";
                    } else {
                        $location.url("/user/" + user._id);
                    }
                })
                .error(function () {

                });
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(user) {
            if(user == null || user.username == null){
                vm.error = "Enter valid name !";
            }else{

                if(user.password == user.verify){
                    UserService
                        .createUser(user)
                        .success(function (user) {
                            $location.url("/user/" + user._id);
                        })
                        .error(function () {

                        });

                }else{
                    vm.error = "Passwords do not match !"
                }
            }
        }
    }

    function ProfileController($routeParams, UserService) {
        var vm = this;
        var userId = $routeParams['uid'];

        UserService
            .findUserById(userId)
            .success(function(user){
                if(user != '0'){
                    vm.user = user;
                }
            })
            .error(function () {

            });

        vm.updateUser = updateUser;

        function updateUser(user) {
            UserService
                .updateUser(userId, user)
                .success(function(user){

                })
                .error(function () {

                });
        }

    }

})();