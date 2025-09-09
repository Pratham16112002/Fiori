sap.ui.define([], function () {
    "use strict";
    return {
        formatStockTextState: function (unitsInStock) {
            unitsInStock = parseInt(unitsInStock, 10)
            if (unitsInStock > 20) {
                return "Ample";
            } else if (unitsInStock > 10) {
                return "Medium";
            } else if (unitsInStock > 0) {
                return "Very low";
            } else {
                return "Out of stock";
            }
        },
        formatStockStatus : function (unitsInStock) {
            unitsInStock = parseInt(unitsInStock, 10)
            if (unitsInStock > 20) {
                return "Success";
            } else if (unitsInStock > 10) {
                return "Information";
            } else if (unitsInStock > 0) {
                return "Warning";
            } else {
                return "Error";
            }
        },
        formatUnitPrice : function (UnitPrice) {
            return 2
        },
    }
})