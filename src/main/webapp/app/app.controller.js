/**
 * Created by centling on 2016/5/3.
 */
(function () {
    'use strict';

    angular
        .module('quayPsApp')
        .controller('appController', MenuController);

    MenuController.$inject = ['$scope', 'AuthServerProvider'];

    function MenuController($scope, AuthServerProvider) {
        if(AuthServerProvider.getToken()){
            $scope.isLoggedin = true;
        }else{
            $scope.isLoggedin = false;
        }

        $scope.$on('authenticationSuccess', function() {
            $scope.isLoggedin = true;
        });

        $scope.$on('logoutSuccess', function() {
            $scope.isLoggedin = false;
        })
    }
})();
