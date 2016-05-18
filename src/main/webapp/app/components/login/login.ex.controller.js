(function() {
    'use strict';

    angular
        .module('quayPsApp')
        .controller('LoginEXController', LoginController);

    LoginController.$inject = ['$rootScope', '$state', '$timeout', 'Auth'];

    function LoginController ($rootScope,$state, $timeout, Auth) {
        var vm = this;

        vm.authenticationError = false;
        vm.cancel = cancel;
        vm.credentials = {};
        vm.login = login;
        vm.password = null;
        vm.register = register;
        vm.rememberMe = true;
        vm.requestResetPassword = requestResetPassword;
        vm.username = null;

        $timeout(function (){angular.element('[ng-model="vm.username"]').focus();});

        function cancel () {
            vm.credentials = {
                username: null,
                password: null,
                rememberMe: true
            };
            vm.authenticationError = false;
        }

        function login (event) {
            event.preventDefault();
            Auth.login({
                username: vm.username,
                password: vm.password,
                rememberMe: vm.rememberMe
            }).then(function () {
                vm.authenticationError = false;
                // If we're redirected to login, our
                // previousState is already set in the authExpiredInterceptor. When login succesful go to stored state
                if ($rootScope.redirected && $rootScope.previousStateName) {
                    $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
                    $rootScope.redirected = false;
                } else {
                    $rootScope.$broadcast('authenticationSuccess');
                }
            }).catch(function () {
                vm.authenticationError = true;
            });
        }

        function register () {
            $state.go('register');
        }

        function requestResetPassword () {
            $state.go('requestReset');
        }
    }
})();
