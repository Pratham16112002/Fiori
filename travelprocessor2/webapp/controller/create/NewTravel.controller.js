sap.ui.define([
    "../Travel.controller",
    "travelprocessor2/util/valueHelp/SingleAgencyValueHelp",
    "travelprocessor2/util/valueHelp/SingleCustomerValueHelp",
    "travelprocessor2/util/valueHelp/CurrencyCodeValueHelp",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
], (TravelController,SingleAgencyValueHelp, SingleCustomerValueHelp,CurrencyCodeDialog, JSONModel,MessageBox) => {
    "use strict";

    return TravelController.extend("travelprocessor2.controller.create.NewTravel", {
        onInit() {
            let LocalModel = new JSONModel({
                AgencyID: "",
                CustomerID: "",
                Description: "",
                BeginDate: null,
                EndDate: null,
                BookingFee: 0,
                TotalPrice: 0,
                CurrencyCode: ""
            })
            this.getView().setModel(LocalModel,"newTravelForm")
            this._agencyHelper = new SingleAgencyValueHelp(this,LocalModel)
            this._customerHelper = new SingleCustomerValueHelp(this,LocalModel)
            this._currencyCodeDialog = new CurrencyCodeDialog(this,LocalModel)
        },
        singleAgencyValueHelpRequest: function () {
            this._agencyHelper.open()
        },
        singleCustomerValueHelpRequest: function () {
            this._customerHelper.open()
        },
        onValueHelpCurrency: function () {
            this._currencyCodeDialog.open()
        },
        onTravelSave: function () {
            const oDateModel = this.oGetModel()
            console.log(oDateModel)
            const LocalModel = this.getView().getModel(("newTravelForm")).getData()
            console.log(LocalModel)
            let payload = {
                AgencyId : LocalModel.AgencyID,
                CustomerId : LocalModel.CustomerID,
                Description : LocalModel.Description,
                StartDate : LocalModel.StartDate,
                EndDate : LocalModel.EndDate,
                BookingFee : LocalModel.BookingFee,
                TotalPrice : LocalModel.TotalPrice
            }
            oDateModel.create("/ZTRVEL_MG_PCDS",payload, {
                success : (oData) => {
                    console.log(oData)
                } ,
                error : (oError) => {
                    let sMessage = "Unexpected error"
                    try {
                        const oResponse = JSON.parse(oError.responseText)
                        if(oResponse.error && oResponse.error.message && oResponse.error.message.value) {
                            sMessage = oResponse.error.message.value
                        }
                    } catch (error) {
                        console.error("Error parsing server response : ",error)
                    }
                    MessageBox.error(sMessage)
                } 
            })
        }
    })
})