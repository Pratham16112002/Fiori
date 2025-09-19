sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/m/SearchField",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Fragment, SearchField, UIColumn, Label, Text, Filter, FilterOperator) {
    return class CustomerValueHelp {
        constructor(oParentControlller) {
            this._oParent = oParentControlller
            this._oDialog = null
            this._oBasicSearch = null
        }
        async open() {
            const oView = this._oParent.getView();
            if (!this._oDialog) {
                this._oDialog = await Fragment.load({
                    id: oView.getId(),
                    name: "travelprocessor2.view.fragments.travel.CustomerValueHelp",
                    controller: this
                })
                const oModel = this._oParent._getTravelUtilityModel();
                this._oDialog.setTokens(oModel.getProperty("/customerID/customerIDVH/selectedItems"))
                this._bindTable()
                oView.addDependent(this._oDialog)
            }
            this._oDialog.open()
        }

        _bindTable() {
            let oFilterBar = this._oDialog.getFilterBar()
            let oValueHelp = this._oDialog
            this._oBasicCustomerSearchField = new SearchField()

            oFilterBar.setBasicSearch(this._oBasicCustomerSearchField)

            this._oBasicCustomerSearchField.attachSearch(function () {
                oFilterBar.search()
            })
            oValueHelp.getTableAsync().then((oTable) => {
                oTable.setModel(this._oParent.getView().getModel())
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
                let oCustomerFirstName = new UIColumn({
                    label: new Label({
                        text: "First Name",
                    }),
                    template: new Text({
                        wrapping: false,
                        text: "{FirstName}"
                    })
                })
                let oCusomterLastName = new UIColumn({
                    label: new Label({
                        text: "Last Name",
                    }),
                    template: new Text({
                        wrapping: false,
                        text: "{LastName}"
                    })
                })
                oTable.addColumn(oCustomerId)
                oTable.addColumn(oCustomerFirstName)
                oTable.addColumn(oCusomterLastName)

            })
        }

        onCancel() {
            this._oDialog.close()
        }
        onOk(oEvent) {
            const aTokens = oEvent.getParameter("tokens")
            const oTokens = aTokens && aTokens.reduce(function (aResult, oController) {
                if (oController) {
                    aResult.push({
                        key: oController.getKey(),
                        text: oController.getText()
                    })
                }
                return aResult
            }, [])
            if (oTokens) {
                this._oParent._getTravelUtilityModel().setProperty("/customerID/customerIDVH/selectedItems", oTokens)
            }
            this._oDialog.close()
        }
        onAfterClose() {
            this._oDialog.close()
        }

        onSearch(oEvnt) {
            let sSearchQuery = this._oBasicCustomerSearchField.getValue()
            let aSelectionSet = oEvnt.getParameter("selectionSet")
            let aFilters = []
            let sFilters = []
            if (sSearchQuery) {
                aSelectionSet.forEach(function (oItem) {
                    if (oItem.getName()) {
                        sFilters.push(new Filter(
                            oItem.getName(),
                            FilterOperator.Contains,
                            sSearchQuery
                        ))
                    }
                }
                )
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
                    let oBinding = oTable.getBinding("rows");
                    oBinding.filter(aFilters, "Application");
                }
            })
            this._oDialog.update()

        }
    }
})