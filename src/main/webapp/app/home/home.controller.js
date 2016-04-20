(function() {
    'use strict';

    angular
        .module('quayPsApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'Principal', 'LoginService','Menu'];

    function HomeController ($scope, Principal, LoginService,Menu) {
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
                return account;
            }).then(function(account){
                vm.menus = Menu.getMenusByRoles(account.authorities)
            });
        }
    }
})();
