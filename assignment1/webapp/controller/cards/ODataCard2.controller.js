sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("assignment1.controller.cards.ODataCard2", {
        onInit : function () {
            console.log(" On It ODataCard2 Controller called")
        },
        onPressOrderDetail : function (oEvent) {
            const oCtx = oEvent.getSource().getBindingContext()
            
            const oOrderId = oCtx.getProperty("OrderID")
            this.getOwnerComponent().getRouter().navTo("OrderDetail" , {
                orderId : oOrderId
            })
        }
    })
})