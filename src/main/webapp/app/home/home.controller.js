(function() {
    'use strict';

    angular
        .module('quayPsApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope','$log', 'Principal', 'LoginService'];

    function HomeController ($scope,$log, Principal, LoginService) {

        var vm = this;

        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;
        vm.menus = null;
        $scope.$on('authenticationSuccess', function() {
            getAccount();
        });

        getAccount();

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
            });
        }
    }
})();
