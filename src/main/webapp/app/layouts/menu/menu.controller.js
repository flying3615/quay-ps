(function() {
    'use strict';

    angular
        .module('quayPsApp')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['$scope', '$state', 'Menu', 'Principal', '$log'];

    function MenuController ($scope, $state, Menu, Principal, $log) {
        //var vm = this;
        //vm.menus = [];
        //vm.loadAll = function() {
        //    Menu.query(function(result) {
        //        vm.menus = result;
        //    });
        //};
        //
        //vm.loadAll();


        Principal.identity().then(function(account){
            Menu.getMenusByRoles(account.authorities).then(function(menus){
                $log.debug(menus);
                $scope.menuList  = changeToTree(menus.data);
            })
        });

        //change data to tree data
        var changeToTree = function(data){
            var parentNodes = []
            //pick up the parent
            angular.forEach(data, function(data){
                if(data.pId == '0'){
                    parentNodes.push(data);
                    data.child = []
                }
            });
            //put all children to its parent
            angular.forEach(parentNodes, function(parentNode){
                angular.forEach(data, function(data){
                    if(data.pId == parentNode.id){
                        parentNode.child.push(data);
                    }
                });
            });
            return parentNodes;
        }

    }
})();
