(function () {
    'use strict';

    angular
        .module('quayPsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('app.sys.editMenu', {
            url: '/sys',
            templateUrl: 'app/sysModule/view/sys.html',
            controller: 'sysController',
            views: {
                'menu@': {
                    templateUrl: 'app/layouts/menu/menu.html',
                    controller: 'MenuController',
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home');
                    return $translate.refresh();
                }]
            }
        });
    }
})();
