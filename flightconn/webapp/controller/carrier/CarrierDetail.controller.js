sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "flightconn/utility/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller,TimeFormatter,Filter,FilterOperator) => {
    "use strict";
    return Controller.extend("flightconn.controller.carrier.CarrierDetail", {
        onInit : function () {
            const oRouter = this.getOwnerComponent().getRouter()
            oRouter.getRoute("CarrierDetail").attachPatternMatched(this._onPatternAttached,this)
        },
        timeFormatter : TimeFormatter,
        _onPatternAttached : function (oEvent) {
            const { carrierId , connId } = oEvent.getParameter("arguments")

            const sPath = `/ZPP_CONN_FL(CarrierId='${carrierId}',ConnectionId='${connId}')`

            var oView = this.getView()
            
            this.getView().bindElement({
                path : sPath,
                events : {
                    dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
                }
            })

            const oTable = this.byId('flightsTable')

            const aFilter = new Filter("CarrierId",FilterOperator.Contains, carrierId)


            oTable.bindRows({
                path : '/ZPP_FLT_INF',
                filters : [aFilter],
            })
        }
    })
})