/*global QUnit*/

sap.ui.define([
	"flightconn/controller/FlightConnection.controller"
], function (Controller) {
	"use strict";

	QUnit.module("FlightConnection Controller");

	QUnit.test("I should test the FlightConnection controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
