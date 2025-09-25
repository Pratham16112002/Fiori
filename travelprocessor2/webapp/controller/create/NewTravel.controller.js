sap.ui.define([
    "../Travel.controller",
    "travelprocessor2/util/valueHelp/SingleAgencyValueHelp",
    "travelprocessor2/util/valueHelp/SingleCustomerValueHelp",
    "travelprocessor2/util/valueHelp/CurrencyCodeValueHelp",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], (TravelController, SingleAgencyValueHelp, SingleCustomerValueHelp, CurrencyCodeDialog, JSONModel, MessageBox, MessageToast) => {
    "use strict";

    return TravelController.extend("travelprocessor2.controller.create.NewTravel", {
        onInit() {
            let LocalModel = new JSONModel({
                AgencyID: {
                    value: undefined,
                    valueState: "None",
                    valueStateText: undefined
                },
                CustomerID: {
                    value: undefined,
                    valueState: "None",
                    valueStateText: undefined
                },
                Description: {
                    value: undefined,
                    valueState: "None",
                    valueStateText: undefined
                },
                BeginDate: {
                    value: undefined,
                    valueStateText: undefined,
                    valueState: "None"
                },
                EndDate: {
                    value: undefined,
                    valueState: "None",
                    valueStateText: undefined
                },
                BookingFee: {
                    value: undefined,
                    valueState: "None",
                    valueStateText: undefined
                },
                TotalPrice: {
                    value: undefined,
                    valueState: "None",
                    valueStateText: undefined
                },
                CurrencyCode: {
                    value: undefined,
                    valueState: "None",
                    valueStateText: undefined
                },
                OverallStatus: {
                    value: undefined
                }
            })
            this.getView().setModel(LocalModel, "newTravelForm")
            this._agencyHelper = new SingleAgencyValueHelp(this, LocalModel)
            this._customerHelper = new SingleCustomerValueHelp(this, LocalModel)
            this._currencyCodeDialog = new CurrencyCodeDialog(this, LocalModel)
        },
        onExit : function () {
            this._resetValueStates()
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
            // Validate the form before attempting to save
            if (!this._validateForm()) {
                return; // Stop execution if validation fails
            }

            const oDateModel = this.oGetModel();
            const LocalModel = this.getView().getModel("newTravelForm").getData();
            
            // Construct the payload with the validated data
            let payload = {
                AgencyId: LocalModel.AgencyID.value,
                CustomerId: LocalModel.CustomerID.value,
                Description: LocalModel.Description.value,
                BeginDate: LocalModel.BeginDate.value,
                EndDate: LocalModel.EndDate.value,
                BookingFee: LocalModel.BookingFee.value,
                TotalPrice: LocalModel.TotalPrice.value,
                OverallStatus: LocalModel.OverallStatus.value,
                CurrencyCode: LocalModel.CurrencyCode.value
            };

            // Call the OData create method
            oDateModel.create("/ZTRVEL_MG_PCDS", payload, {
                success: (oData) => {
                    console.log(oData)
                    MessageToast.show("Travel request created successfully!");
                    this._resetValueStates(); // Reset form state on success
                    // Optional: Navigate back or clear form data
                },
                error: (oError) => {
                    let sMessage = "Unexpected error";
                    try {
                        const oResponse = JSON.parse(oError.responseText);
                        if (oResponse.error && oResponse.error.message && oResponse.error.message.value) {
                            sMessage = oResponse.error.message.value;
                        }
                    } catch (error) {
                        console.error("Error parsing server response: ", error);
                    }
                    MessageBox.error(sMessage);
                }
            });
        },
        
        /**
         * Private method to validate form inputs.
         * @returns {boolean} true if the form is valid, false otherwise.
         */
        _validateForm: function() {
            const LocalModel = this.getView().getModel("newTravelForm");
            const oData = LocalModel.getData();
            let bIsValid = true;
            
            // Define an object mapping field names to their required state and error messages
            const aFields = [
                { name: "AgencyID", required: true, message: "AgencyID is required" },
                { name: "CustomerID", required: true, message: "CustomerID is required" },
                { name: "BeginDate", required: true, message: "BeginDate is required" },
                { name: "EndDate", required: true, message: "EndDate is required" },
                { name: "CurrencyCode", required: true, message: "CurrencyCode is required" },
                { name: "TotalPrice", required: true, message: "Enter a valid Price", regex: /^(?!0+(\.0+)?$)\d+(\.\d+)?$/ },
                { name: "BookingFee", required: true, message: "Enter a valid BookingFee", regex: /^(?!0+(\.0+)?$)\d+(\.\d+)?$/ }
            ];

            // Iterate through the fields and perform validation
            aFields.forEach(oField => {
                const sValue = oData[oField.name].value;
                const bIsEmpty = !sValue || sValue === "";
                
                // Clear previous error states
                LocalModel.setProperty(`/${oField.name}/valueState`, "None");
                LocalModel.setProperty(`/${oField.name}/valueStateText`, undefined);
                
                if (oField.required && bIsEmpty) {
                    LocalModel.setProperty(`/${oField.name}/valueState`, "Error");
                    LocalModel.setProperty(`/${oField.name}/valueStateText`, oField.message);
                    bIsValid = false;
                } else if (oField.regex && !oField.regex.test(sValue)) {
                    LocalModel.setProperty(`/${oField.name}/valueState`, "Error");
                    LocalModel.setProperty(`/${oField.name}/valueStateText`, oField.message);
                    bIsValid = false;
                }
            });

            return bIsValid;
        },
        
        /**
         * Private method to reset all form value states to "None".
         */
        _resetValueStates: function() {
            const LocalModel = this.getView().getModel("newTravelForm");
            const oData = LocalModel.getData();
            
            for (const sField in oData) {
                if (oData[sField].hasOwnProperty("valueState")) {
                    LocalModel.setProperty(`/${sField}/valueState`, "None");
                    LocalModel.setProperty(`/${sField}/valueStateText`, undefined);
                    LocalModel.setProperty(`/${sField}/value`,undefined)
                }

            }
        }
    });
});
