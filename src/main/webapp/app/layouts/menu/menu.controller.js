(function() {
    'use strict';

    angular
        .module('quayPsApp')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['$scope', '$state', 'Menu'];

    function MenuController ($scope, $state, Menu) {
        var vm = this;
        vm.menus = [];
        vm.loadAll = function() {
            Menu.query(function(result) {
                vm.menus = result;
            });
        };

        vm.loadAll();


        //$scope.menuList = [];
        //
        //$http.get(mainService.baseUrl+'management/menu/getMenuByRoleForLogin').success(function(data){
        //    $scope.menuList = changeToTree(data);
        //}).error(function(data){
        //    $rootScope.authenticated = false;
        //})
        //
        ////change data to tree data
        //var changeToTree = function(data){
        //    var parentNodes = []
        //    //pick up the parent
        //    angular.forEach(data, function(data){
        //        if(data.pId == '0'){
        //            parentNodes.push(data);
        //            data.child = []
        //        }
        //    });
        //    //put all children to its parent
        //    angular.forEach(parentNodes, function(parentNode){
        //        angular.forEach(data, function(data){
        //            if(data.pId == parentNode.id){
        //                parentNode.child.push(data);
        //            }
        //        });
        //    });
        //    return parentNodes;
        //}

    }
})();
