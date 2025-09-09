sap.ui.define([
    "sap/ui/core/UIComponent",
    "flightconn/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("flightconn.Component", {
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

            // set the Utlity Model
            this.setModel(models.createUtilityModel(),"flightViewConfig")

            // enable routing
            this.getRouter().initialize();
        }
    });
});