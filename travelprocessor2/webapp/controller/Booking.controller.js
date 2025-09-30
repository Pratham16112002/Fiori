sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "travelprocessor2/util/formatter"
], (Controller, Filter, FilterOperator,Formatter) => {
    "use strict";
    return Controller.extend("travelprocessor2.controller.Booking", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Booking").attachPatternMatched(this._onObjectMatched, this);
        },
        formatter : Formatter,
        _onObjectMatched: function (oEvent) {
            var { sEncodedPath, travelId }  = oEvent.getParameter("arguments").path;

            this.getView().byId("pageTitle").setTitle(travelId)

            var sPath = "/" + sEncodedPath
            var oView = this.getView();
            const oTable = oView.byId("bookingTable")
            oTable.bindRows(sPath)

        }
    })
})