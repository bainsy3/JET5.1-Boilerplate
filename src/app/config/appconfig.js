define(['json!./config.json', 'config/serviceconfig', 'utils/commonhelper'
], function (config, serviceConfig, commonHelper) {
    'use strict';

    function AppConfig() {
        var self = this;
        self.config = config;

        self.getConfigurations = function() {
            return self.config;
        };
        
        self.getService = function(serviceName) {
            return serviceConfig.services[serviceName];
        };
        
        self.getServiceUrl = function(serviceName, uriParameters, queryParameters) {
            if (serviceConfig.mockMode) 
                return serviceConfig.services[serviceName].mockuri;
            var service = serviceConfig.services[serviceName];
            var serviceUri = service.uri;
            if(service.sessionUriParameters)
                for(var param in service.sessionUriParameters){  
                        serviceUri = serviceUri.replace(new RegExp('{' + param  + '}', 'g'), commonHelper.getSessionAttr(service.sessionUriParameters[param]));
                        console.log(param + " : " + service.sessionUriParameters[param] +  " : " + commonHelper.getSessionAttr(service.sessionUriParameters[param]) + " : " + serviceUri);
                }
            if(service.uriParameters)
                for(var param in service.uriParameters){  
                        serviceUri = serviceUri.replace(new RegExp('{' + param  + '}', 'g'), uriParameters[param]);
                        console.log(param + " : " + uriParameters[param] + " : " + serviceUri);
                }
            if(queryParameters) {
                var symbolix = serviceUri.indexOf('?') === -1 ? '?' : '&';
                for(var param in queryParameters){  
                        serviceUri = serviceUri + symbolix + param + '=' + queryParameters[param];
                        symbolix = '&';
                        console.log(param + " : " + queryParameters[param] + " : " + serviceUri);
                }           
            }
            return self.get('servicesUrlPrefix') + serviceUri;
        };
        
        self.get = function(key) {
            return self.config[key];
        };
        
        self.set = function(key, value) {
            self.config[key] = value;
        };
    }

    return new AppConfig();
});
