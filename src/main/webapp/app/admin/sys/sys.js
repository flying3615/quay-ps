(function () {
    'use strict';

    angular
        .module('quayPsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {

        $stateProvider.
        state('editMenu', {
            parent: 'admin',
            url: '/editMenu',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'audits.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/admin/sys/view/sysEditMenu.html',
                    controller: 'sysEditMenuController'
                }
            }
        }).
        state('roleAssign', {
            parent: 'admin',
            url: '/roleAssign',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'audits.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/admin/sys/view/sysRoleAssign.html',
                    controller: 'sysRoleAssignController'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('audits');
                    return $translate.refresh();
                }]
            }
        });
    }
})();
