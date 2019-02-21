/*
 * JET boiler plate application
 * This boiler plate has been created as a quick start for POC and production ready grade applications
 * Addtional modules include:
 *  - Jasmine
 *  - Moment
 * @author <arunb3@live.com>
 */

'use strict';

/**
 * Example of Require.js boostrap javascript
 */

requirejs.config({
    baseUrl: '.',

    // Path mappings for the logical module names
    // Update the main-release-paths.json for release mode when updating the mappings
    paths:
    //injector:mainReleasePaths

    {
        'knockout': 'js/libs/knockout/knockout-3.4.2.debug',
        'jquery': 'js/libs/jquery/jquery-3.3.1',
        'jqueryui-amd': 'js/libs/jquery/jqueryui-amd-1.12.1',
        'promise': 'js/libs/es6-promise/es6-promise',
        'hammerjs': 'js/libs/hammer/hammer-2.0.8',
        'ojdnd': 'js/libs/dnd-polyfill/dnd-polyfill-1.0.0',
        'ojs': 'js/libs/oj/v5.1.0/debug',
        'ojL10n': 'js/libs/oj/v5.1.0/ojL10n',
        'ojtranslations': 'js/libs/oj/v5.1.0/resources',
        'text': 'js/libs/require/text',
        'signals': 'js/libs/js-signals/signals',
        'customElements': 'js/libs/webcomponents/custom-elements.min',
        'css': 'js/libs/require-css/css',
        'json': 'js/libs/require/json',
        'moment': 'js/libs/moment/moment.min',
        'components': 'app/components',
        'config': 'app/config',
        'pages': 'app/pages',
        'utils': 'app/utils'
    }
    //endinjector
    ,
    // Shim configurations for modules that do not expose AMD
    shim:
    {
        jquery:
        {
            exports: ['jQuery', '$']
        }
    }
});

require(['ojs/ojcore', 'knockout', 'jquery', 'json!config/featureControl.json', 'ojs/ojknockout', 'ojs/ojmodule', 'ojs/ojrouter'
], function (oj, ko, $, featureControl) {
        // Define the path to the page models (js)
        oj.ModuleBinding.defaults.modelPath = 'app/';
        // Define the path to the page views (html)
        oj.ModuleBinding.defaults.viewPath = 'text!app/';

        //var getTranslation = oj.Translations.getTranslatedString;
        var router = oj.Router.rootInstance;
        // Define moduleConfig for later use
        var moduleConfig;
        // Define var to decide the type of device app is being viewed from (cordova or web)
        var isCordova = typeof window.cordova !== 'undefined';

        // Define place holder object to store mock user details *This can be deleted*
        var loggedInUser = {
            employeeId: ko.observable(''),
            fusionPersonId: ko.observable(''),
            employeeFirstName: ko.observable(''),
            employeeLastName: ko.observable(''),
            managerId: ko.observable(''),
            managerFirstName: ko.observable(''),
            managerLastName: ko.observable(''),
            isLineManager: ko.observable(false),
            isDutyManager: ko.observable(false),
            managerFullName: ko.observable('')
        };


        /*
         * Funtion to determine user access to routes
         * @returns {boolean} 
         */
        var _canEnterFn = function () {
            // Place any app entry logic on routing in here
            return true;
        };

        /*
         * Funtion to determine user access to routes
         * @param {string} path Path of the application as passed by the router config 
         * @returns {string} pagePath Returns the page path of the selected route
         */
        function getPagePath(path) {
            // path = exception, isAdaptive = true then pages/manager/exceptions/exceptions.html + exceptions.js
            var pagePath = 'pages/' + path + '/' + path.substr(path.lastIndexOf('/') + 1);
            return pagePath;
        }

        /*
         * Configure application router paths
         */
        router.configure({
            'splash': { value: getPagePath('splash'), label: 'Splash', isDefault: true },
            'dashboard': { value: getPagePath('dashboard'), label: 'Dashboard', canEnter: _canEnterFn }
        });

        /*
         * Define the RootViewModel function bound to the index.html page
         */
        function RootViewModel(params) {
            var self = this;
            // Define router to 'ojs/ojrouter' lib
            self.router = router;
            // Define the app feature control configuration
            self.featureControl = featureControl;
            // As a test, log the feature control config
            console.log(self.featureControl);

            // Run initialisation functions for app e.g. get translations
            function init() {

            }

            moduleConfig = $.extend(true, {}, self.router.moduleConfig, {
                params: {
                    'rootContext': {}
                }
            });
            self.moduleConfig = moduleConfig;

            /*
             * Call the router to display the module of the click element ID
             * @param {string} data
             * @param {string} event
             */
            self.onSelect = function (data, event) {
                router.go(event.currentTarget.id);
            };

            /*
             * Call the router to display the module of the route passed
             * @param {string} data
             */
            self.go = function (route) {
                router.go(route);
            };

            /*
             * Simple 'back' function
             */
            self.goBack = function () {
                window.history.go(-1);
            };

            // If running in a hybrid (e.g. Cordova) environment, we need to wait for the deviceready
            // event before executing any code that might interact with Cordova APIs or plugins.
            if ($(document.body).hasClass('oj-hybrid')) {
                document.addEventListener('deviceready', init);
            } else {
                init();
            }

        }

        // Sync & apply router binding to specified element within the index.html file
        $(function () {
            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
            oj.Router.sync().then(function () {
                ko.applyBindings(new RootViewModel(), document.getElementById('globalBody'));
            },
                function (error) {
                    oj.Logger.error('Error in root start: ' + error.message);
                }
            );
        });

    });
