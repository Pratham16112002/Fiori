sap.ui.define([
  'sap/ui/core/format/DateFormat'
], function (DateFormat) {
    "use strict";
  
    return {
      formatTime: function (oTime) {
        if (!oTime || !oTime.ms) return "";
        const oDate = new Date(oTime.ms + new Date(0).getDate());
        return sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "hh:mm a" }).format(oDate);
      },
      formatDate : function (date) {
        const oDate = new Date(date)
        const oFormat = DateFormat.getDateInstance({
          pattern : 'dd MMM yyyy'
        })
        return oFormat.format(oDate)

      }
    };
  });
  