sap.ui.define([
    "sap/ui/core/mvc/Controller",
], (Controller) => {
    "use strict";
    return Controller.extend("assignment1.controller.details.ProductDetail", {
        onInit : function () {
            this.getOwnerComponent().getRouter().getRoute("ProductDetail").attachPatternMatched(this._onProductMatched,this)
        },
        _onProductMatched : function (oEvnt) {
            const sProductId = oEvnt.getParameter("arguments").productId
            const sPath = "/Products(" + sProductId + ")";
            this.getView().bindElement({
                path : sPath
            })
        },
        goHome : function () {
            const oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("RouteSuppliers",{},true)
        }
    })
})