sap.ui.define([
    "sap/ui/core/mvc/Controller"
  ], function (Controller) {
    "use strict";
    return Controller.extend("assignment1.controller.cards.ODataCard", {
  
      onInit: function () {
        console.log("On It ODataCard Controller called")
      },

      onPressProductDetail: function (oEvent) {
        const oCtx = oEvent.getSource().getBindingContext();
        const oProductID = oCtx.getProperty("ProductID")
        this.getOwnerComponent().getRouter().navTo("ProductDetail", {
          productId: oProductID
        });
      }
  
    });
  });