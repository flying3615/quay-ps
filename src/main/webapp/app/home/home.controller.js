(function() {
    'use strict';

    angular
        .module('quayPsApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope','$log', 'Principal', 'LoginService','AlertService'];

    function HomeController ($scope,$log, Principal, LoginService,AlertService) {

        AlertService.success("This is a success message, it is green");

        AlertService.info("This is an info message, it is blue");

        AlertService.warning("This is a warning message, it is amber");

        AlertService.error("This is an error message, it is red");

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
