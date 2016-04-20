(function() {
    'use strict';
    angular
        .module('quayPsApp')
        .factory('Menu', Menu);

    Menu.$inject = ['$resource','$http','$log'];

    function Menu ($resource,$http,$log) {
        var resourceUrl =  'api/menus/:id';

        //return $resource(resourceUrl, {}, {
        //    'query': { method: 'GET', isArray: true},
        //    'get': {
        //        method: 'GET',
        //        transformResponse: function (data) {
        //            data = angular.fromJson(data);
        //            return data;
        //        }
        //    },
        //    'update': { method:'PUT' }
        //});

        var service = {
            getMenusByRoles: getMenusByRoles
        };

        function getMenusByRoles(roles){
            $log.debug(roles)
            return $http({
                method: "post",
                url: "api/menusByRole",
                data: JSON.stringify(roles)
            });
            //return $http.post('api/menusByRole',{header:'Content-type: application/json',data:JSON.stringify(roles)})
            //return $http.get('api/menus',{header:'Content-type: application/json',data:roles})
        }

        return service;
    }
})();
