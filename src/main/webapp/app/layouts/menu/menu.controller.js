(function () {
    'use strict';

    angular
        .module('quayPsApp')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['$scope', '$state', 'Menu', 'Principal', '$log'];

    function MenuController($scope, $state, Menu, Principal, $log) {

        Principal.identity().then(function (account) {
            Menu.getMenusByRoles(account.authorities).then(function (menus) {
                $scope.menuList = changeToTree(menus.data);
            })
        });

        //change data to tree data
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

    }
})();
