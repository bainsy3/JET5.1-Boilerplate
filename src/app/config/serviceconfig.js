define(['jquery', 'json!./services.json', 'json!./config.json', 'utils/appui', 'utils/commonhelper'
], function ($, services, config, commonHelper) {
    'use strict';

    function ServiceConfig() {
        var self = this;
        self.services = services;
        self.config = config;

        /**
         * Function that retrieves the details of a given service name 
         * @param {type} serviceName
         */
        self.getService = function (serviceName) {
            return self.services[serviceName];
        };
        
        /*
         * Mock mode is used to develop in an offline mode and call stub service data
         */
        self.mockMode = true;
        
        /**
         * Function that retrieves the url to a service endpoint
         * @param {type} serviceName
         * @param {type} uriParameters
         * @param {type} queryParameters
         */
        self.getServiceUrl = function (serviceName, uriParameters, queryParameters) {
            if (self.mockMode) {
                if (window.__karma__) {
                    return 'base/www/' + self.services[serviceName].mockuri;
                } else {
                    return self.services[serviceName].mockuri;
                }
            }
            var service = self.services[serviceName];
            var serviceUri = service.uri;
            if (service.sessionUriParameters)
                for (var param in service.sessionUriParameters) {
                    serviceUri = serviceUri.replace(new RegExp('{' + param + '}', 'g'), commonHelper.getSessionAttr(service.sessionUriParameters[param]));
                }
            if (uriParameters) {
                for (var param in service.uriParameters) {
                    serviceUri = serviceUri.replace(new RegExp('{' + param + '}', 'g'), uriParameters[param]);
                }
            }
            if (queryParameters) {
                var symbolix = serviceUri.indexOf('?') === -1 ? '?' : '&';
                for (var param in queryParameters) {
                    serviceUri = serviceUri + symbolix + param + '=' + queryParameters[param];
                    symbolix = '&';
                }
            }
            if (self.services[serviceName].serviceType === 'OSB') {
                return self.config['servicesUrlPrefix'] + serviceUri;
            } else if (self.services[serviceName].serviceType === 'HCM') {
                return self.config['hcmUrlPrefix'] + serviceUri;
            }
        };

        /**
         * Function that executes a GET service
         * @param {type} serviceName
         * @param {type} uriParameters
         * @param {type} queryParameters
         * @returns {Promise}
         */
        self.callGetService = function (serviceName, uriParameters, queryParameters) {
            var defer = $.Deferred();
            var service = self.getService(serviceName);
            var serviceUrl = self.getServiceUrl(serviceName, uriParameters, queryParameters);
            $.ajax({
                type: service.method,
                contentType: service.contentType,
                dataType: service.dataType,
                url: serviceUrl,
                beforeSend: function (xhr) {
                    // Use the following to set request headers or pass authentication tokens
                    // An example is given
                    // xhr.setRequestHeader('Authorization', 'Bearer ' + commonHelper.getSessionAttr('app.jwtToken'));
                    // xhr.withCredentials = true;
                },
                success: function (data) {
                    if (data) {
                        if (service && service.primaryObject) {
                            defer.resolve(data[service.primaryObject], {status: 200});
                        } else if (service) {
                            defer.resolve(data, {status: 200});
                        }
                    } else if (!data) {
                        defer.resolve(null, {status: 200});
                    }
                },
                error: function (xhr) {
                    console.log(xhr);
                }
            });
            return $.when(defer);
        };

        /**
         * Function that execute a POST service
         * @param {type} serviceName
         * @param {type} payload
         * @param {type} uriParameters
         * @param {type} queryParameters
         * @returns {Promise}
         */
        self.callPostService = function (serviceName, payload, uriParameters, queryParameters) {
            var defer = $.Deferred();
            if (self.mockMode)
                return defer.resolve("{'SUCCESS'}", {status: 200});
            var service = self.getService(serviceName);
            var serviceUrl = self.getServiceUrl(serviceName, uriParameters, queryParameters);
            $.ajax({
                type: service.method,
                contentType: service.contentType,
                dataType: service.dataType,
                url: serviceUrl,
                data: payload,
                beforeSend: function (xhr) {
                    // Use the following to set request headers or pass authentication tokens
                    // An example is given
                    // xhr.setRequestHeader('Authorization', 'Bearer ' + commonHelper.getSessionAttr('app.jwtToken'));
                    // xhr.withCredentials = true;
                },
                success: function (responseData) {
                    defer.resolve(responseData, {status: 200});
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr, ajaxOptions, thrownError);
                }
            });
            return $.when(defer);
        };
    }
    return new ServiceConfig();
});
