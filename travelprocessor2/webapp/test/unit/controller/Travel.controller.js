/*global QUnit*/

sap.ui.define([
	"travelprocessor2/controller/Travel.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Travel Controller");

	QUnit.test("I should test the Travel controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
