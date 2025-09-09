sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
], (Controller,Filter) => {
    "use strict";
    return Controller.extend("assignment1.controller.details.OrderDetail" , {
        onInit : function () {
            this.getOwnerComponent().getRouter().getRoute("OrderDetail").attachPatternMatched(this._onDetailMatched,this)
        },
        _onDetailMatched : function (oEvnt) {
            const { orderId } = oEvnt.getParameter("arguments")
            const oList = this.byId("orderDetailsList")
            const oFilter = new Filter("OrderID","EQ",orderId.toString())
            const that = this
            // Binding the filtered order details to the list
            oList.bindItems({
                path : "/Order_Details",
                filters : [oFilter],
                template : new sap.m.ObjectListItem({
                    title : "Product ID : {ProductID}",
                    number : "{UnitPrice}",
                    numberUnit : "USD",
                    attributes : [
                        new sap.m.ObjectAttribute({ 
                            text : "Quantity : {Quantity}",
                        }),
                        new sap.m.ObjectAttribute({
                            text : "Discount : {Discount}"
                        })
                    ]
                }),
                events : {
                    dataReceived : function (oEvnt) {
                        const aData = oEvnt.getParameter("data") 
                        const iList = aData.results ?? []
                        const oList = that.byId("orderDetailsList") 
                        const oCount = iList.length
                        oList.setHeaderText(`Order Line Count :${oCount.toString()}`)

                    }
                }
            })
        },
        goHome : function () {
            const oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("RouteSuppliers",{},true)
        }
    })
})