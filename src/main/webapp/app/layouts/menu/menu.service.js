(function() {
    'use strict';
    angular
        .module('quayPsApp')
        .factory('Menu', Menu);

    Menu.$inject = ['$resource','$http','$log'];

    function Menu ($resource,$http,$log) {
        var resourceUrl =  'api/menus/:id';

        var menuResource = $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });

        var service = {
            getMenusByRoles: getMenusByRoles,
            menuResource:  menuResource,
            getMenusTree: getMenusTree,
            getRolesByMenu:getRolesByMenu
        };

        function getMenusByRoles(roles){
            $log.debug(roles)
            return $http({
                method: "post",
                url: "api/menusByRole",
                data: JSON.stringify(roles)
            });
        }

        function getMenusTree(roles){
            return $http({
                method: "post",
                url: "api/menusTree",
                data: JSON.stringify(roles)
            });
        }


        function getRolesByMenu(menu_url){
            return $http({
                method: "get",
                url: "api/rolesByMenu/"+menu_url,
                cache:true
            });
        }

        return service;
    }
})();
