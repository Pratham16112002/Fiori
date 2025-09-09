sap.ui.define([
    "sap/ui/core/UIComponent",
    "travelprocessor/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("travelprocessor.Component", {
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

            // enable routing
            this.getRouter().initialize();
        }
    });
});