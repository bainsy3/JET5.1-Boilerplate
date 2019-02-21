define(['ojs/ojcore', 'knockout', 'utils/appui', './splashService', 'jquery'],
    function (oj, ko, ui, service, $) {

        function SplashViewModel() {

            // Define this as self
            var self = this;

            // Example of UI busy status
            ui.showBusy();
            setInterval(function () {
                ui.hideBusy();
            }, 2000);


            self.init = function () {
                // Sample service calls
                // OSB call
                var cbOsbSuccessFn = function (data) {
                    // Example calling toast dialogue message
                    ui.showToast('toastSuccess', 'OSB Service Call Returned Okay');
                    console.log(data);
                };
                var cbOsbFailFn = function (data) {
                    console.log(data);
                };
                // HCM call
                service.sampleOsbServiceCall().then(cbOsbSuccessFn, cbOsbFailFn);
                var cbHcmSuccessFn = function (data) {
                    console.log(data);
                };
                var cbHcmFailFn = function (data) {
                    console.log(data);
                };
                service.sampleHcmServiceCall().then(cbHcmSuccessFn, cbHcmFailFn);
            };

            /**
             * Sample coverage function, returns true if value is defined
             * @param {type} value
             * @returns {undefined}
             */
            self.sampleCoverage = function (value) {
                if (value) {
                    return true;
                } else {
                    return false;
                }
            };

            /**
             * Sample of an SVG loader where value would represent a progress target
             */
            self.handleBindingsApplied = function (info) {
                // Executes after all the bindings applied and all jet components are ready in view
                // Get all the Meters
                var meters = document.querySelectorAll('.meter');
                meters.forEach((path) => {
                    // Get the length of the path
                    var length = path.getTotalLength();
                    // Get the value of the meter
                    var value = 100;
                    // Calculate the percentage of the total length
                    var to = length * ((100 - value) / 100);
                    // Trigger Layout in Safari hack https://jakearchibald.com/2013/animated-line-drawing-svg/
                    path.getBoundingClientRect();
                    // Set the Offset
                    path.style.strokeDashoffset = Math.max(0, to);
                });
            };

            self.init();

        }

        return new SplashViewModel();
    });
