sap.ui.define([
    "sap/ui/core/UIComponent",
    "travelprocessor2/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("travelprocessor2.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // set the overallstatus model
            this.setModel(models.createOverallStatusModel(),"overAllStatus")

            // set the Utility Model
            this.setModel(models.createTravelUtilityModel(),"travelConfig")

            // set Booking utlity model
            this.setModel(models.createBookingUtilityModel(),"bookConfig")

            // enable routing
            this.getRouter().initialize();
        }
    });
});