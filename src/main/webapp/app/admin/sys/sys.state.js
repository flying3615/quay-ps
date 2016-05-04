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
                is_dynamic_menu:  true,
                menu_url:  "editMenu"
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
                is_dynamic_menu:  true,
                menu_url:  "editMenu"
            },
            views: {
                'content@': {
                    templateUrl: 'app/admin/sys/view/sysRoleAssign.html',
                    controller: 'sysRoleAssignController'
                }
            },
            resolve: {
                //国际化用的，在translation.config.js里需要用到$translatePartialLoader，来找i18n/lang/part.json
                //这里要用到user-management的国际化文件
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('user-management');
                    return $translate.refresh();
                }]
            }
        });
    }
})();
