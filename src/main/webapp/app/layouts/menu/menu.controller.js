(function () {
    'use strict';

    angular
        .module('quayPsApp')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['$scope', '$state', 'Menu', 'Principal', '$log'];

    function MenuController($scope, $state, Menu, Principal, $log) {

        //wrap in a login/logout event

        $scope.authenticated = null;

        var getMenus = function(){
            Principal.identity().then(function (account) {
                if(account){
                    Menu.getMenusByRoles(account.authorities).then(function (menus) {
                        $scope.menuList = changeToTree(menus.data);
                        $scope.authenticated = Principal.isAuthenticated;
                    })
                }
            });
        }

        var changeToTree = function (data) {
            var parentNodes = []
            //pick up the parent
            angular.forEach(data, function (data) {
                if (!data.parent) {
                    parentNodes.push(data);
                    data.child = []
                }
            });
            //put all children to its parent
            angular.forEach(parentNodes, function (parentNode) {
                angular.forEach(data, function (data) {
                    if(data.parent){
                        if (data.parent.id == parentNode.id) {
                            parentNode.child.push(data);
                        }
                    }
                });
            });
            return parentNodes;
        }

        $scope.$on('authenticationSuccess', function() {
            getMenus();
        });

        getMenus();

        $scope.$on('logoutSuccess', function() {
            $scope.menuList = [];
            // menus sidebar needs to be collapsed
        })

    }
})();
