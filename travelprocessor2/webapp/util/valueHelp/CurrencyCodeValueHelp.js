sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Fragment,Filter,FilterOperator) {
    return class CustomerSelectDialog {
        constructor(oParentController,oLocalModel){
            this._oParent = oParentController
            this._oDialog = null
            this._oLocalModel = oLocalModel
        }

        async open() {
            const oView = this._oParent.getView()
            if(!this._oDialog) {
                this._oDialog = await Fragment.load({
                    id : oView.getId(),
                    name : "travelprocessor2.view.fragments.CurrencyCodeDialog",
                    controller : this
                })
                oView.addDependent(this._oDialog)
            }
            this._oDialog.open()
        }

        onSearch(oEvnt) {
            const oValue = oEvnt.getParameter("value")
            const oSelectDialog = this._oParent.byId("CurrencyCodeSelectDialog")

            if(oValue && oSelectDialog) {
                oSelectDialog.getBinding("items").filter(new Filter("Currency",FilterOperator.Contains,oValue))
            }
            return
        }
        onConfirmDialogClose(oEvnt) {
            const oSelectedItem = oEvnt.getParameter("selectedItem")
            if(oSelectedItem){
                console.log(oSelectedItem)
                this._oLocalModel.setProperty("/CurrencyCode/value",oSelectedItem.getTitle())
            }
            this.removeFilter()
        }
        onCancelDialogClose(oEvnt) {
            const oSelectDialog = this.byId("CurrencyCodeSelectDialog")
            if(oSelectDialog){
                oSelectDialog.getBinding("items").filter([])
            }
           this.removeFilter() 
        }
        removeFilter() {
             const oSelectDialog = this._oParent.byId("CurrencyCodeSelectDialog")
            if(oSelectDialog){
                oSelectDialog.getBinding("items").filter([])
            }
        }

    }
})