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
        createOverallStatusModel : function () {
            let oModel = new JSONModel();
            oModel.loadData(sap.ui.require.toUrl("travelprocessor2/model/travel/overallstatus.json"))
            return oModel;
        },
        createTravelUtilityModel : function () {
            let oModel = new JSONModel();
            oModel.loadData(sap.ui.require.toUrl("travelprocessor2/model/travel/configTravelModel.json"))
            return oModel;p
        },
        createBookingUtilityModel : function () {
          let oModel = new JSONModel();
            oModel.loadData(sap.ui.require.toUrl("travelprocessor2/model/booking/configBookingModel.json"))
        }
    };

});