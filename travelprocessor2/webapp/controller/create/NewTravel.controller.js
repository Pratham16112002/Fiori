sap.ui.define([
    "../Travel.controller",
    "travelprocessor2/util/valueHelp/SingleAgencyValueHelp",
    "travelprocessor2/util/valueHelp/SingleCustomerValueHelp",
    "sap/ui/model/json/JSONModel"
], (TravelController, SingleAgencyValueHelp, SingleCustomerValueHelp, JSONModel) => {
    "use strict";

    return TravelController.extend("travelprocessor2.controller.create.NewTravel", {
        onInit() {
            let LocalModel = new JSONModel({
                AgencyID: "",
                CustomerID: "",
                Description: "",
                StartDate: null,
                EndDate: null,
                BookingFee: 0,
                TotalPrice: 0,
                CurrencyCode: "USD"
            })
            this.getView().setModel(LocalModel,"newTravelForm")
            this._agencyHelper = new SingleAgencyValueHelp(this,LocalModel)
            this._customerHelper = new SingleCustomerValueHelp(this,LocalModel)
        },
        singleAgencyValueHelpRequest: function () {
            this._agencyHelper.open()
        },
        singleCustomerValueHelpRequest: function () {
            this._customerHelper.open()
        }
    })
})