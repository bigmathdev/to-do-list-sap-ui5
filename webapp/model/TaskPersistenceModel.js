sap.ui.define([], function() {
	"use strict";

	const STORAGE_KEY = "ui5-tasks";

	return {
		loadTasks: function() {
			const data = window.localStorage.getItem(STORAGE_KEY);
			return data ? JSON.parse(data) : [];
		},

		saveTasks: function(tasks) {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
		},

		clearTasks: function() {
			window.localStorage.removeItem(STORAGE_KEY);
		}
	};
});