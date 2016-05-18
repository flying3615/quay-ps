(function() {
    'use strict';

    angular
        .module('quayPsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('app', {
            abstract: true,
            views: {
                'navbar@': {
                    templateUrl: 'app/layouts/navbar/navbar.html',
                    controller: 'NavbarController',
                    controllerAs: 'vm'
                },
                'menu@': {
                    templateUrl: 'app/layouts/menu/menu.directive.html',
                    controller: 'MenuController',
                },
                'login@': {
                    templateUrl: 'app/login/login.html',
                    controller: 'MenuController',
                }
            },
            resolve: {
                authorize: ['Auth',
                    function (Auth) {
                        return Auth.authorize();
                    }
                ],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('global');
                }],

            }
        });
    }
})();
