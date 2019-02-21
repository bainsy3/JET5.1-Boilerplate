define(['ojs/ojcore', 'knockout', 'jquery', 'utils/appui', 'config/serviceconfig'
], function (oj, ko, $, ui, service) {

    /**
     * Splash page view model
     * @param {object} params Application parameters
     */
    function templateViewModel(params) {
        // Define this as self
        var self = this;
        // Grant page acces to data bound to the globalBody element in index.html
        var MainViewModel = ko.dataFor(document.getElementById('globalBody'));
        // Define the router to call for routing actions
        var router = params.ojRouter.parentRouter;
        
        // App UI helpers
        console.log(ui);
        // App config helpers
        console.log(service);
        
        // Example calling toast dialogue message
        ui.showToast('toastSuccess', 'Example Toast');
        
        // Example of UI busy status
        ui.showBusy();
        setInterval(function () {
            ui.hideBusy();
        }, 6000);
        
        /*
         * Example of setting a rootContext item
         * rootContext allows us to access this item from other models (app pages)
         */
        params.rootContext.test = 'test rootContext item';
        console.log(params.rootContext);
        
    }

    return templateViewModel;
});
