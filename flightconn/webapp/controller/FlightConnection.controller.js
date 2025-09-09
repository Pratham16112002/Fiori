sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "flightconn/utility/formatter",
    "sap/ui/core/Fragment",
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'

], (Controller,TimeFormatter,Fragment,Filter , FilterOperator) => {
    "use strict";

    return Controller.extend("flightconn.controller.FlightConnection", {
        onInit() {
        },
        timeFormatter : TimeFormatter,
        getFlightUtilyModel : function () {
            return this.getView().getModel("flightViewConfig")
        },
        onSearch : function (oEvent) {
            var sQuery = oEvent.getSource().getValue()
            var aFilters = [new Filter("CarrierId",FilterOperator.Contains,sQuery),
                new Filter("CarrierId_Text", FilterOperator.Contains, sQuery )
            ];
            const oCombinedFilter = new Filter({
                filters : aFilters,
                and : false
            })
           var oBinding =  this.byId("flightConnTable").getBinding("rows")
            oBinding.filter([oCombinedFilter])
        },
        onAirportValueHelp : function (oEvnt) {
            var oView = this.getView();
            this._sCurrentField = oEvnt.getSource().getId();
            if(!this._arrivalAirportValueHelp){
                this._arrivalAirportValueHelp = Fragment.load({
                    id : oView.getId(),
                    name : "flightconn.view.fragments.agency.AirportValueHelp",
                    controller : this
                }).then(function (oArrivalAirportValueHelpDialog){
                    oView.addDependent(oArrivalAirportValueHelpDialog);
                    return oArrivalAirportValueHelpDialog;
                })
            }
            this._arrivalAirportValueHelp.then(function (oArrivalAirportValueHelpDialog) {
                oArrivalAirportValueHelpDialog.open()
            }.bind(this))
        },
        handleAirportSearch : function (oEvnt) {
            const sValue = oEvnt.getParameter("value")
            const aFilters = [
                new Filter("AirportId", FilterOperator.Contains, sValue),
                new Filter("Name" , FilterOperator.Contains , sValue),
                new Filter("City" , FilterOperator.Contains , sValue),
                new Filter("Country" , FilterOperator.Contains,sValue)
            ]
            const oCombinedFilter = new Filter({
                filters : aFilters,
                and : false 
            })
            const oBinding = oEvnt.getSource().getBinding("items")
            oBinding.filter([oCombinedFilter])
        },
        handleValueHelpClose : function (oEvnt) {
            var oBinding = oEvnt.getSource().getBinding("items")
            oBinding.filter([])

            var aContext = oEvnt.getParameter("selectedItem")
            var oBindingContext = aContext.getBindingContext()
            if(!oBindingContext) return;

            var object = oBindingContext.getObject()
            var oModel = this.getFlightUtilyModel()
            
            // console.

            if(this._sCurrentField === "application-app-preview-component---FlightConnection--departureAirportIdInput"){
                oModel.setProperty("/departureAirportInput/text",object.AirportId)

            } 
            if(this._sCurrentField === "application-app-preview-component---FlightConnection--arrivalAirportIdInput"){
                oModel.setProperty("/arrivalAirportInput/text",object.AirportId)
            }
            this._sCurrentField = null
        },
        onApplyFilter : function () {
            var oModel = this.getFlightUtilyModel()
            const oArriveAirportId = oModel.getProperty("/arrivalAirportInput/text")
            const oDepartAirportId = oModel.getProperty("/departureAirportInput/text")

            const oFlightConnections = this.byId("flightConnTable")

            const oBinding = oFlightConnections.getBinding("rows")
            console.log(oBinding)
            let aFilters = []
            if(oArriveAirportId){
                aFilters.push(new Filter("ArrivalAirportID",FilterOperator.EQ, oArriveAirportId))
            }
            if(oDepartAirportId){
                aFilters.push(new Filter("DepartureAirportID",FilterOperator.EQ, oDepartAirportId))
            }
            // Clear previous filters
            oBinding.filter([])

            // Add new filters
            oBinding.filter(aFilters)
            

            oModel.setProperty("clearFilterButton/visibility",true)
        },
        onClearFilter : function () {
            const oFlightConnections = this.byId("flightConnTable")

            const oBinding = oFlightConnections.getBinding("rows")

            oBinding.filter([])
        },
        onRowSelect : function (oEvent) {
            const oTable = oEvent.getSource();
            const iIndex = oEvent.getParameter("rowIndex");
            const oContext = oTable.getContextByIndex(iIndex)
            const oObject = oContext.getObject()
            const oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("CarrierDetail",{
                carrierId : oObject.CarrierId,
                connId : oObject.ConnectionId
            })
        }
    });
});