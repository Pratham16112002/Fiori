sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], (Controller, MessageBox, JSONModel, Fragment, Filter, FilterOperator) => {
	"use strict";

	return Controller.extend("assignment1.controller.Suppliers", {

		onInit: function () {
			var oModel = new JSONModel();
			oModel.loadData("/model/products.json")
			this.getView().setModel(oModel, "jsonProducts")
		},
		getUtilityModel : function () {
			return this.getView().getModel("supplierViewConfig")
		},
		onValueHelpRequested: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue()
			var oView = this.getView()
			if (!this._employeeSearchDialog) {
				this._employeeSearchDialog = Fragment.load({
					name: "assignment1.view.fragments.ValueHelpDialog",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog)
					return oDialog
				})
			}
			this._employeeSearchDialog.then(function (oDialog) {
				oDialog.getBinding("items").filter[new Filter("FirstName", FilterOperator.Contains, sInputValue), new Filter("LastName", FilterOperator.Contains, sInputValue)]
				oDialog.open(sInputValue)
			})
		},
		onValueHelpSearch: function (oEvent) {
			const sValue = oEvent.getParameter("value");

			// Filter for serach both the firstName and lastName 
			const oCombinedFilter = new Filter({
				filters: [
					new Filter("FirstName", FilterOperator.Contains, sValue),
					new Filter("LastName", FilterOperator.Contains, sValue)
				],
				and: false
			});

			oEvent.getSource().getBinding("items").filter([oCombinedFilter]);
		},
		onValueHelpClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem")
			oEvent.getSource().getBinding("items").filter([])
			if (!oSelectedItem) {
				return;
			}
			const oObject = oSelectedItem.getBindingContext().getObject()
			console.log(oObject)
			console.log(oObject.EmployeeID)
			var uModel = this.getUtilityModel()
			uModel.setProperty("/employeeInput/text",oObject.EmployeeID)
		},
		onPressProductDetail: function (oEvt) {
			console.log(oEvt)
		},
		onFilterHandler: function () {
			const sCoBox = this.byId("storeComboBox")
			const key = sCoBox.getSelectedKey()
			const uModel = this.getUtilityModel()
			const oEmployeeId = uModel.getProperty("/employeeInput/text")
			if(oEmployeeId){
				const CardView3 = this.byId("oDataCardView3")
				const oOrderList = CardView3.byId("orderList")
				const oBinding = oOrderList.getBinding("items")
				uModel.setProperty("/clearFilter/visibility",true)
				oBinding.filter([new Filter("EmployeeID" , "EQ" , oEmployeeId)])
			}

			if(key){
				const oFilter = new Filter("SupplierID", "EQ", key)
				const oODataCardview = this.byId("oDataCardView2")
				const listItems = oODataCardview.byId("productList")
				const oJsonDataCardView = this.byId("oJsonDataView")
				const oJsonListItems = oJsonDataCardView.byId("jsonProductList")
				oJsonListItems.getBinding("items").filter([oFilter])
				listItems.getBinding("items").filter([oFilter])
				uModel.setProperty("/clearFilter/visibility",true)
			}

			
		},
		onClearFilter: function () {

			const uModel = this.getUtilityModel()
			const oODataCardview = this.byId("oDataCardView2")
			const listItems = oODataCardview.byId("productList")
			const oJsonDataCardView = this.byId("oJsonDataView")
			// Setting the selected combo box key to null 
			const sCoBox = this.byId("storeComboBox")
			sCoBox.setSelectedKey(null)

			// Removing the filters on Lists
			const oJsonListItems = oJsonDataCardView.byId("jsonProductList")
			listItems.getBinding("items").filter([])
			oJsonListItems.getBinding("items").filter([])

			uModel.setProperty("/clearFilter/visibility",false)
			

		},
		getRouter: function () {
			return this.getOwnerComponent().getRouter()
		},
		navTo: function (sRouteName, oParams) {
			return this.getRouter().navTo(sRouteName, oParams || {})
		},
		getModel: function (sName) {
			return this.getView().getModel(sName)
		},
		setModel: function (sModel, sName) {
			return this.getView().setModel(oModel, sName)
		}

	});
});