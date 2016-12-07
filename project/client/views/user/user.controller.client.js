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
                .login(user)
                .success(function(user){
                    if(user === '0') {
                        vm.error = "Unable to login!";
                    } else {
                        $location.url("/user/" + user._id);
                    }
                })
                .error(function (error) {
                    if (error == "Unauthorized") {
                        vm.error = "Invalid username and password combination";
                    }
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
                        .register(user)
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
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        UserService
            .findCurrentUser()
            .success(function(user){
                if(user != '0'){
                    vm.user = user;
                    vm.userId = user._id;
                }
            })
            .error(function () {

            });

        vm.updateUser = updateUser;

        function updateUser(user) {
            UserService
                .updateUser(vm.userId, user)
                .success(function(user){

                })
                .error(function () {

                });
        }

        function logout() {
            UserService
                .logout()
                .success(function () {
                    $location.url("/login");
                })
                .error(function (err) {
                    console.log("Error logging out user");
                    console.log(err);
                });
        }

        function deleteUser() {
            UserService
                .deleteUser(vm.userId)
                .success(function () {
                    $location.url("/login");
                })
                .error(function (error) {
                    console.error(error);
                })
        }
    }

})();