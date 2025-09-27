// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ], (Controller) => {
//     "use strict";

//     return Controller.extend("todolist.controller.todo", {
//         onInit() {
//         }
//     });
// });

sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
  "use strict";

  return Controller.extend("todolist.controller.todo", {
    onInit: function () {
      var oData = {
        tasks: [
          { title: "Estudar SAPUI5", done: false },
          { title: "Criar To-Do List", done: true }
        ]
      };
      var oModel = new JSONModel(oData);
      this.getView().setModel(oModel);
    },

    onAddTask: function () {
      var oView = this.getView();
      var sValue = oView.byId("newTaskInput").getValue();
      if (sValue) {
        var oModel = oView.getModel();
        var aTasks = oModel.getProperty("/tasks");
        aTasks.push({ title: sValue, done: false });
        oModel.setProperty("/tasks", aTasks);
        oView.byId("newTaskInput").setValue("");
      }
    },

    onToggleTask: function (oEvent) {
      var oContext = oEvent.getSource().getBindingContext();
      var bSelected = oEvent.getParameter("selected");
      oContext.getModel().setProperty(oContext.getPath() + "/done", bSelected);
    }
  });
});
