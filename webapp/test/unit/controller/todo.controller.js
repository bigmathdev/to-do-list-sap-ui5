/*global QUnit*/

sap.ui.define([
	"todolist/controller/todo.controller"
], function (Controller) {
	"use strict";

	QUnit.module("todo Controller");

	QUnit.test("I should test the todo controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
