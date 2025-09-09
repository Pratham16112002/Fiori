sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/table/Column",
    "sap/m/SearchField",
    "sap/m/Text",
    "sap/m/Label",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "travelprocessor2/util/formatter"
], (Controller, Fragment,UIColumn,SearchField,Text,Label,Filter,FilterOperator,Formatter) => {
    "use strict";

    return Controller.extend("travelprocessor2.controller.Travel", {
        onInit() {
        },
        formatter : Formatter,
        _getTravelUtilityModel : function () {
            return this.getView().getModel("travelConfig") 
        },
        _getOverallStatusUtilityModel : function () {
            return this.getView().getModel("overAllStatus")
        },

        // Controller
        // Information for Agency 
        // Value help request 

        agencyValueHelpRequest : function () {
            let oView = this.getView()
            if(!this._agencyDialog) {
                Fragment.load({
                    id : oView.getId(),
                    name : "travelprocessor2.view.fragments.travel.AgencyValueHelp",
                    controller : this
                }).then((oDialog) => {
                    this._agencyDialog = oDialog
                    let oModel = this._getTravelUtilityModel()
                    this._agencyDialog.setTokens(oModel.getProperty("/agencyID/agencyIDVH/selectedItems"))
                    this._bindAgencyValueHelpTable()
                    oView.addDependent(this._agencyDialog)
                    oDialog.open()
                })
            } else {
                this._agencyDialog.open()
            }
        },

        _bindAgencyValueHelpTable : function () {
            let oFilterBar = this._agencyDialog.getFilterBar()
            let oValueHelp = this._agencyDialog
            this._oBasicSearchField = new SearchField()

            oFilterBar.setBasicSearch(this._oBasicSearchField)

            this._oBasicSearchField.attachSearch(function (){
                oFilterBar.search()
            })

            oValueHelp.getTableAsync().then((oTable) => {
                oTable.setModel(this.getView().getModel());
                if(oTable.bindRows){
                    oTable.bindAggregation("rows",{
                        path : "/xDMOxI_Agency",
                        events : {
                            dataReceived : function () {
                                oValueHelp.update()
                            }
                        }
                    })
                }
                let oAgencyId = new UIColumn({
                    label : new Label({text : "Agency ID"}),
                    template : new Text({
                        wrapping : false,
                        text : "{AgencyID}"
                    })
                })
                let oAgencyName = new UIColumn({
                    label : new Label({text : "Agency Name"}),
                    template : new Text({
                        wrapping : true,
                        text : "{Name}"
                    })
                })
                oTable.addColumn(oAgencyId)
                oTable.addColumn(oAgencyName)
            })
        },

        onAgencyValueHelpCancelPress : function () {
            this._agencyDialog.close()
        },

        onAgencyValueHelpOkPress : function (oEvent) {
            const aTokens = oEvent.getParameter("tokens")
            const oTokens = aTokens && aTokens.reduce(function (aResult,oControl){
                if(oControl) {
                    aResult.push({
                        key : oControl.getKey(),
                        text : oControl.getText()
                    })
                }
                return aResult
            },[])
            if(oTokens){
                this._getTravelUtilityModel().setProperty("/agencyID/agencyIDVH/selectedItems",oTokens)
            }
            this._agencyDialog.close()

        },
        onAgencyValueHelpAfterClose : function () {
            this._agencyDialog.close()
        },

        // Controller 
        // Information for Customer 
        // value help Request
        

        customerValueHelpRequest: function () {
            let oView = this.getView()
            if (!this._customerDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "travelprocessor2.view.fragments.travel.CustomerValueHelp",
                    controller: this
                }).then((oDialog) => {
                    this._customerDialog = oDialog
                    let oModel = this._getTravelUtilityModel()
                    this._customerDialog.setTokens(oModel.getProperty("/customerID/customerIDVH/selectedItems"))
                    this._bindCustomerValueHelpTable()
                    oView.addDependent(this._customerDialog)
                    oDialog.open()
                })
            } else {
                this._customerDialog.open()
            }
        },
        _bindCustomerValueHelpTable: function () {
            let oFilterBar = this._customerDialog.getFilterBar()
            let oValueHelp = this._customerDialog
            this._oBasicSearchField = new SearchField()

            oFilterBar.setBasicSearch(this._oBasicSearchField)

            this._oBasicSearchField.attachSearch(function (){
                oFilterBar.search()
            })

            oValueHelp.getTableAsync().then((oTable) => {

                oTable.setModel(this.getView().getModel());
                if(oTable.bindRows) {
                    oTable.bindAggregation("rows" , {
                        path : "/xDMOxI_Customer",
                        events : {
                            dataReceived : function () {
                                oValueHelp.update()
                            }
                        }
                    })
                }
                let oCustomerId = new UIColumn({
                    label : new Label({ text : "Customer ID"}),
                    template : new Text({
                        wrapping : false,
                        text : "{CustomerID}"
                    })
                })
                let oCustomerFirstName = new UIColumn({
                    label : new Label({ text : "First Name"}),
                    template : new Text({
                        wrapping : false,
                        text : "{FirstName}"
                    })
                })
                oTable.addColumn(oCustomerId)
                oTable.addColumn(oCustomerFirstName)
            })
        },
        onCustomerValueHelpCancelPress : function () {
            this._customerDialog.close()
        },
        onCustomerValueHelpOkPress : function (oEvent) {
            const aTokens = oEvent.getParameter("tokens");
            const oTokens = aTokens && aTokens.reduce(function (aResult,oControl){
                if(oControl){
                    aResult.push({
                        key : oControl.getKey(),
                        text : oControl.getText()
                    })
                }
                return aResult
            },[])
            if(oTokens){
                this._getTravelUtilityModel().setProperty("/customerID/customerIDVH/selectedItems",oTokens)
            }
            
            this._customerDialog.close()
        },
        onCustomerValueHelpAfterClose : function () {
            this._customerDialog.close()
        },
        onCustomerFilterBarSearch : function (oEvnt) {
            let sSearchQuery = this._oBasicSearchField.getValue()
            
            // An array of control Inputs like DatePicker , Input , MultiInput,...etc
			let	aSelectionSet = oEvnt.getParameter("selectionSet");
            let aFilters = aSelectionSet && aSelectionSet.reduce(function (aResult,oControl){
                // To get the actual values
                if(oControl.getValue() && oControl.getName() ){
                    aResult.push(new Filter(
                         oControl.getName(),
                        FilterOperator.Contains,
                        oControl.getValue()
                    ))
                }
                return aResult
            },[])
            aFilters.push(
                new Filter({
                    filters : [
                        new Filter("CustomerID",FilterOperator.Contains,sSearchQuery),
                        new Filter("FirstName",FilterOperator.Contains,sSearchQuery)
                    ],
                    and : false
                }))
            let oFilter = new Filter({
                filters : aFilters,
                and : true
            })

            let customerVHD = this._customerDialog
            this._customerDialog.getTableAsync().then(function (oTable) {
                if(oTable.bindRows){
                    oTable.getBinding("rows").filter(oFilter)
                }
                customerVHD.update()
            })
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
        }
    });
});