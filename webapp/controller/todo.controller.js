sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
  "use strict";

  return Controller.extend("todolist.controller.todo", {
    onInit: function () {

      //modelo inicial com algumas tarefas
      var oData = {
        tasks: [
          { title: "Estudar SAPUI5", done: false, tag: "Alta", date: "20/12/2024" },
          { title: "Criar To-Do List", done: false, tag: "Média", date: "22/12/2024" },
        ]
      };
      var oModel = new JSONModel(oData);
      this.getView().setModel(oModel);
    },

    //função para adicionar tarefa
    onAddTask: function () {
      var oView = this.getView();
      var sValue = oView.byId("newTaskInput").getValue();
      var sTag = oView.byId("prioritySelect").getSelectedItem() ? oView.byId("prioritySelect").getSelectedItem().getText() : "";
      var sDate = oView.byId("taskDatePicker").getDateValue() ? oView.byId("taskDatePicker").getDateValue().toLocaleDateString() : "";

      if (sValue) {
        var oModel = oView.getModel();
        var aTasks = oModel.getProperty("/tasks");

        aTasks.push({ title: sValue, done: false, tag: sTag, date: sDate });
        oModel.setProperty("/tasks", aTasks);
        oView.byId("newTaskInput").setValue("");
        oView.byId("prioritySelect").setSelectedKey("low");
      }
    },

    //função para marcar tarefa como concluída
    onToggleTask: function (oEvent) {
      var oContext = oEvent.getSource().getBindingContext();
      var bSelected = oEvent.getParameter("selected");
      oContext.getModel().setProperty(oContext.getPath() + "/done", bSelected);
    },

    //função para adicionar tarefa ao pressionar Enter
    onInputSubmit: function() {
      this.onAddTask();
    }
  });
});
