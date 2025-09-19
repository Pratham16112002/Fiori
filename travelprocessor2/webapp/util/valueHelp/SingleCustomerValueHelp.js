sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/m/SearchField",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Fragment, SearchField, UIColumn, Label, Text, Filter, FilterOperator) {

    return class SingleCustomerValueHelp {
        constructor(oParentController,oLocalModel) {
            this._oParent = oParentController
            this._oDialog = null;
            this._oBasicSearch = null;
            this._oLocalModel = oLocalModel;
        }

        async open() {
            const oView = this._oParent.getView();

            if (!this._oDialog) {
                this._oDialog = await Fragment.load({
                    id: oView.getId(),
                    name: "travelprocessor2.view.fragments.travel.SingleCustomerValueHelp",
                    controller: this
                });

                this._bindTable();
                oView.addDependent(this._oDialog)
            }
            this._oDialog.open();
        }

        _bindTable() {
            let oFilterBar = this._oDialog.getFilterBar()
            let oValueHelp = this._oDialog
            this._oBasicAgencycSearchField = new SearchField()


            oFilterBar.setBasicSearch(this._oBasicAgencycSearchField)

            this._oBasicAgencycSearchField.attachSearch(function () {
                oFilterBar.search()
            })

            oValueHelp.getTableAsync().then((oTable) => {
                oTable.setModel(this._oParent.getView().getModel());
                if (oTable.bindRows) {
                    oTable.bindAggregation("rows", {
                        path: "/xDMOxI_Customer",
                        events: {
                            dataReceived: function () {
                                oValueHelp.update()
                            }
                        }
                    })
                }
                let oCustomerId = new UIColumn({
                    label: new Label({ text: "Customer ID" }),
                    template: new Text({
                        wrapping: false,
                        text: "{CustomerID}"
                    })
                })
                let oFirstName = new UIColumn({
                    label: new Label({ text: "FirstName" }),
                    template: new Text({
                        wrapping: true,
                        text: "{FirstName}"
                    })
                })
                let oLastName = new UIColumn({
                    label : new Label({ text : "LastName"}),
                    template : new Text({
                        wrapping : true,
                        text : "{LastName}"
                    })
                })
                oTable.addColumn(oCustomerId)
                oTable.addColumn(oFirstName)
                oTable.addColumn(oLastName)
            })
        }

        onCancel() {
            this._oDialog.close()
        }
        onOk(oEvent) {
            const aTokens = oEvent.getParameter("tokens")
            if(aTokens && aTokens.length > 0){
                const aToken = aTokens[0]
                this._oLocalModel.setProperty("/CustomerID",aToken.getKey())
            } 
            this._oDialog.close()
        }
        onAfterClose() {
            this._oDialog.close()
        }
        onSearch(oEvnt) {
            let sSearchquery = this._oBasicAgencycSearchField.getValue()
            let aSelectionSet = oEvnt.getParameter("selectionSet")
            let aFilters = []
            let sFilters = []
            if (sSearchquery) {
                aFilters = aSelectionSet && aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getName()) {
                        sFilters.push(new Filter(
                            oControl.getName(),
                            FilterOperator.Contains,
                            sSearchquery
                        ))
                    }
                    return aResult
                }, [])
            }
            aFilters.push(new Filter({
                filters: sFilters,
                and: false
            }));
            let oFilterBar = oEvnt.getSource()
            let aFilterGroupItems = oFilterBar.getFilterGroupItems()
            aFilterGroupItems.forEach(function (oItem) {
                let sName = oItem.getName()
                let oControl = oItem.getControl()
                let sValue = oControl.getValue()
                if (sValue) {
                    aFilters.push(new Filter(sName, FilterOperator.EQ, sValue))
                }
            })
            this._oDialog.getTableAsync().then(function (oTable) {
                if (oTable.bindRows) {
                   const oBinding =  oTable.getBinding("rows").filter(aFilters)
                    oBinding.filter(aFilters, "Application");
                }
            })
            this._oDialog.update()
        }
    }

})