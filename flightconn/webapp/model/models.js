sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
function (JSONModel, Device) {
    "use strict";

    return {
        /**
         * Provides runtime information for the device the UI5 app is running on as a JSONModel.
         * @returns {sap.ui.model.json.JSONModel} The device model.
         */
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },
        createUtilityModel: function () {
            var oViewConfigModel = new JSONModel();
            oViewConfigModel.setDefaultBindingMode("TwoWay")
            var sUrl = sap.ui.require.toUrl("flightconn/model/utility.json"); 
            oViewConfigModel.loadData(sUrl);
            return oViewConfigModel
        }
    };

});