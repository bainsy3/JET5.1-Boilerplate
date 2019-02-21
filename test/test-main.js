var tests = [];
var modules = [];
var SPEC_REGEXP = /Spec\.js$/;
//is in the viewmodel folder
var VIEWMODEL_REGEXP = /viewModels\//;
//ends with .js
var JS_REGEXP = /\.js$/;

/**
* This function converts a given js path to requirejs module
*/
var jsToModule = function (path) {
    return path.replace(/^\/base\/src\/js\//, '').replace(/\.js$/, '');
};

for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (SPEC_REGEXP.test(file)) {
      tests.push(file);
    }
    else if (VIEWMODEL_REGEXP.test(file) && JS_REGEXP.test(file)) {
        modules.push(jsToModule(file));
    }
  }
}

var startTest= function(){
  //Load the modules before calling karma start.
  require(modules, function () { 
    window.__karma__.start();
  });
};

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/www',

 paths:
  //same as in the main.js
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
    'services': 'app/services',
    "moment":"js/libs/moment/moment.min",
    "json":"js/libs/require/json",
    'config':'app/config',
    'pages':'app/pages',
    'utils':'app/utils'
  }
  //endinjector
  ,
  // Shim configurations for modules that do not expose AMD
  shim:
  {
    'jquery':
    {
      exports: ['jQuery', '$']
    }
  },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: startTest
});

