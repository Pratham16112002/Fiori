sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "travelprocessor2/util/formatter",
    "travelprocessor2/util/valueHelp/AgencyValueHelp",
    "travelprocessor2/util/valueHelp/CustomerValueHelp"
], (Controller,Filter,FilterOperator,Formatter,AgencyValueHelp,CustomerValueHelp) => {
    "use strict";

    return Controller.extend("travelprocessor2.controller.Travel", {
        onInit() {
            this._agencyHelper = new AgencyValueHelp(this);
            this._customerHelper = new CustomerValueHelp(this)
        },
        formatter : Formatter,
        _getTravelUtilityModel : function () {
            return this.getView().getModel("travelConfig") 
        },
        _getOverallStatusUtilityModel : function () {
            return this.getView().getModel("overAllStatus")
        },

        getRouter :function () {
            return this.getOwnerComponent().getRouter()
        },
        onExit() {
            this._getTravelUtilityModel().setProperty("/customerID/customerIDVH/selectedItems",[])
            this._getTravelUtilityModel().setProperty("/agencyID/agencyIDVH/selectedItems",[])
        },
        oGetModel() {
            return this.getView().getModel()
        },

        // Controller
        // Information for Agency 
        // Value help request 

        agencyValueHelpRequest : function () {
            this._agencyHelper.open()
        },

        customerValueHelpRequest: function () {
            this._customerHelper.open()
        },
       
        handleFilterPress : function () {
            let oConfigModel = this._getTravelUtilityModel()
            let customerIds = oConfigModel.getProperty("/customerID/customerIDVH/selectedItems")
            let aFilter = []
            if(customerIds && customerIds.length > 0) {
                let customerIdFilters = customerIds && customerIds.reduce(function (aResult,oControl){
                    if(oControl){
                        aResult.push(new Filter("CustomerId",FilterOperator.EQ,oControl.key))
                    }
                    return aResult
                },[])
                aFilter.push(new Filter({
                    filters : customerIdFilters,
                    and : false
                }))
            }
            let agencyIds = oConfigModel.getProperty("/agencyID/agencyIDVH/selectedItems")
            if(agencyIds && agencyIds.length > 0){
                let agencyIdFilters = agencyIds && agencyIds.reduce(function (aResult,oControl){
                    if(oControl){
                        aResult.push(new Filter("AgencyId",FilterOperator.EQ,oControl.key))
                    }
                    return aResult
                },[])
                aFilter.push(new Filter({
                    filters : agencyIdFilters,
                    and : false,
                }))
            }
            let startDate = oConfigModel.getProperty("/startDate/value")
            if(startDate){
                debugger;
                aFilter.push(new Filter("BeginDate",FilterOperator.EQ,startDate))
            }
            let endDate = oConfigModel.getProperty("/endDate/value")
            if(endDate){
                debugger;
                aFilter.push(new Filter("EndDate",FilterOperator.EQ,endDate))
            }
            let oOverallsTatusModel = this._getOverallStatusUtilityModel()
            let oOverallStatusKeys = oOverallsTatusModel.getProperty("/selectedKeys")
            if(oOverallStatusKeys && oOverallStatusKeys.length > 0){
                const n_aFilter = oOverallStatusKeys && oOverallStatusKeys.reduce(function (oResult,oControl){
                    if(oControl){
                        oResult.push(new Filter("OverallStatus",FilterOperator.EQ,oControl))
                    }
                    return oResult
                },[])
                if(n_aFilter.length > 0){
                    aFilter.push(new Filter({
                        filters : n_aFilter,
                        and : true
                    }))
                }
            }

            if(aFilter.length > 0){
                let oTable = this.byId("travelTable")
                let oBinding = oTable.getBinding("rows")
                oBinding.filter(aFilter)
            }
        },
        handleFilterReset : function () {
            let oTable = this.byId("travelTable");
            let oBinding = oTable.getBinding("rows");
            oBinding.filter([])
        },
        navigateToCreateTravelHandler : function () {
            this.getRouter().navTo("NewTravel")
        }
    });
});