sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function (DateFormat) {
    "use strict";

    return {
        formatWithName: function (id, name) {
            return id + " (" + name + ")";
        },
        formatOverallStatus: function (code) {
            if (code) {
                switch (code) {
                    case 'X':
                        return "Error"
                    case 'A':
                        return "Success"
                    case 'O':
                        return "Information"
                    default:
                        return "None"
                }
            }
        },
        formatBookingStatus : function (code) {
            if(code) {
                switch (code) {
                    case 'X':
                        return "Cancelled"
                    case 'N':
                        return "New"
                    case 'B':
                        return "Booked"
                    default:
                        return "None"
                        break;
                }
            }
        },
        formatDate : function (oDate) {
            if(!oDate){
                return ""
            }
            var oDateFormat = DateFormat.getDateTimeInstance({
                pattern : "dd-MM-yyy"
            })
            return oDateFormat.format(oDate) 
        }
    }
})