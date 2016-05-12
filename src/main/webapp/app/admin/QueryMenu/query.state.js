(function () {
    'use strict';
    angular
        .module('quayPsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {

        $stateProvider.
        state('cargoQuery', {
            parent: 'admin',
            url: '/cargoQuery',
            data: {
                is_dynamic_menu:  true,
                menu_url:  "cargoQuery"
            },
            views: {
                'content@': {
                    templateUrl: 'app/admin/QueryMenu/view/cargoQuery.html',
                    controller: 'QueryController'
                }
            },
            //for test, websocket!!!
            onEnter: function(JhiTrackerService) {
                JhiTrackerService.subscribe();
            },
            onExit: function(JhiTrackerService) {
                JhiTrackerService.unsubscribe();
            }
            //resolve: {
            //    //国际化用的，在translation.config.js里需要用到$translatePartialLoader，来找i18n/lang/part.json
            //    //这里要用到user-management的国际化文件
            //    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
            //        $translatePartialLoader.addPart('query');
            //        return $translate.refresh();
            //    }]
            //}
        }).
        state('historyQuery', {
            parent: 'admin',
            url: '/historyQuery',
            data: {
                is_dynamic_menu:  true,
                menu_url:  "historyQuery"
            },
            views: {
                'content@': {
                    templateUrl: 'app/admin/QueryMenu/view/historyQuery.html',
                    controller: 'QueryController'
                }
            },
            //resolve: {
            //    //国际化用的，在translation.config.js里需要用到$translatePartialLoader，来找i18n/lang/part.json
            //    //这里要用到user-management的国际化文件
            //    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
            //        $translatePartialLoader.addPart('query');
            //        return $translate.refresh();
            //    }]
            //}
        }).
        state('mobileAuthQuery', {
            parent: 'admin',
            url: '/mobileAuthQuery',
            data: {
                is_dynamic_menu:  true,
                menu_url:  "mobileAuthQuery"
            },
            views: {
                'content@': {
                    templateUrl: 'app/admin/QueryMenu/view/mobileAuthQuery.html',
                    controller: 'QueryController'
                }
            },
            //resolve: {
            //    //国际化用的，在translation.config.js里需要用到$translatePartialLoader，来找i18n/lang/part.json
            //    //这里要用到user-management的国际化文件
            //    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
            //        $translatePartialLoader.addPart('query');
            //        return $translate.refresh();
            //    }]
            //}
        });
    }
})();
