define(['config/serviceconfig'
], function (serviceConfig) {

    function splashService() {

        this.sampleOsbServiceCall = function () {
            return serviceConfig.callGetService('sampleOsbServiceCall', {}, {});
        };

        this.sampleHcmServiceCall = function () {
            return serviceConfig.callGetService('sampleHcmServiceCall', {}, {});
        };

    }

    return new splashService();
    
});


