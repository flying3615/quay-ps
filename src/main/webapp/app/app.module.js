(function() {
    'use strict';

    angular
        .module('quayPsApp', [
            'ngStorage',
            'tmh.dynamicLocale',
            'pascalprecht.translate',
            'ngResource',
            'ngCookies',
            'ngAria',
            'ngCacheBuster',
            'ngFileUpload',
            'ui.bootstrap',
            'ui.bootstrap.datetimepicker',
            'ui.router',
            'ui.select',
            'ngSanitize',
            'infinite-scroll',
            // jhipster-needle-angularjs-add-module JHipster will add new module here
            'angular-loading-bar',
            'ui.layout',
            //'ngTouch',
            'ui.grid',
            'ui.grid.pagination',
            'ui.grid.selection',  //ui-grid function of selection
            'ui.grid.exporter',
            'ui.grid.saveState',
            'ui.grid.cellNav',
            'ui.grid.resizeColumns',
            'ui.grid.moveColumns',
            'ui.grid.pinning',
            'ui.grid.grouping',
        ])
        .run(run);

    run.$inject = ['stateHandler', 'translationHandler',"$rootScope","Principal"];

    function run(stateHandler, translationHandler,$rootScope,Principal) {
        stateHandler.initialize();
        translationHandler.initialize();
        $rootScope.isAuthenticated = Principal.isAuthenticated;
    }
})();
