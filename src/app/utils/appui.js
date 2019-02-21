define(['knockout', 'jquery'
], function (ko, $) {
    'use strict';

    var busy = null;

    function AppUIHelper() {
        var self = this;

        function init() {
            self.toastModel = new toastModel();
            ko.applyBindings(self.toastModel, document.getElementById('toast'));
        }

        /**
         * Show app busy status
         */
        self.showBusy = function () {
            if (busy === null) {
                busy = $("#busy");
            }
            if (busy.is(":hidden")) {
                busy.show();
            }
        };

        /**
         * Hide app busy status
         */
        self.hideBusy = function () {
            if (busy === null) {
                busy = $("#busy");
            }
            var defer = $.Deferred();
            if (busy.is(":visible")) {
                busy.fadeOut(300, defer.resolve);
            }
            return $.when(defer);
        };

        self.showToast = function (type, message) {
            self.toastModel.updateModel(type, message);
        };
        
        init();
        
    }

    function toastModel() {
        /*
         * Toast type is expected as:
         * toastSuccess
         * toastWarning
         * toastError
         */
        this.toastType = ko.observable();
        // Content of toast message
        this.toastMessage = ko.observable();
        // Dismiss the toast dialogue on user click
        this.dismissToast = function () {
            $("#toast").removeClass('show');
        };
        // Pass the updated toast message and display
        this.updateModel = function (type, message) {
            this.toastType(type);
            this.toastMessage(message);
            $("#toast").addClass('show');
            setTimeout(function () {
                $("#toast").removeClass('show');
            }, 3000);
        };
    }

    return new AppUIHelper();
});
