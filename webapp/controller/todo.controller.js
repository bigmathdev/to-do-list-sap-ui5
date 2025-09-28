// sap.ui.define(
//   [
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/model/json/JSONModel",
//     "sap/m/MessageBox",
//   ],
//   function (Controller, JSONModel) {
//     "use strict";

//     return Controller.extend("todolist.controller.todo", {
//       onInit: function () {
        
//         //modelo inicial com algumas tarefas
//         var oData = {
//           tasks: [
//             {
//               id: 1,
//               title: "Estudar SAPUI5",
//               done: false,
//               tag: "Alta",
//               date: "20/12/2024",
//             },
//             {
//               id: 2,
//               title: "Criar To-Do List",
//               done: false,
//               tag: "Média",
//               date: "22/12/2024",
//             },
//           ],
//         };

//         var oView = this.getView();
//         var oModel = oView.getModel();
//         // var aTasks = oModel.getProperty("/tasks");
//         var oModel = new JSONModel(oData);
//         this.getView().setModel(oModel);

//         // restringe a data mínima para o dia atual
//         var today = new Date();
//         today.setHours(0, 0, 0, 0);
//         var oDateModel = new JSONModel({ ui5date: today });
//         this.getView().setModel(oDateModel, "dateModel");
//       },

//       //função para adicionar tarefa
//       onAddTask: function () {
//         var oView = this.getView();
//         var sValue = oView.byId("newTaskInput").getValue();
//         var sTag = oView.byId("prioritySelect").getSelectedItem()
//           ? oView.byId("prioritySelect").getSelectedItem().getText()
//           : "";
//         var sDate = oView.byId("taskDatePicker").getDateValue()
//           ? oView.byId("taskDatePicker").getDateValue().toLocaleDateString()
//           : "";

//         //validação para que a data seja preenchida
//         var oDatePicker = oView.byId("taskDatePicker");
//         if (!sDate) {
//           oDatePicker.setValueState("Error");
//           oDatePicker.setValueStateText(
//             "Preencha a data de abertura do chamado."
//           );
//           return;
//         } else {
//           oDatePicker.setValueState("None");
//         }

//         if (sValue) {
//           var oModel = oView.getModel();
//           var aTasks = oModel.getProperty("/tasks");
//           aTasks.push({
//             id: Date.now(),
//             title: sValue,
//             done: false,
//             tag: sTag,
//             date: sDate,
//           });
//           oModel.setProperty("/tasks", aTasks);
//           oView.byId("newTaskInput").setValue("");
//           oView.byId("prioritySelect").setSelectedKey("low");
//           oDatePicker.setValue("");
//         }
//       },

//       //função para marcar tarefa como concluída
//       onToggleTask: function (oEvent) {
//         var oContext = oEvent.getSource().getBindingContext();
//         var bSelected = oEvent.getParameter("selected");
//         oContext
//           .getModel()
//           .setProperty(oContext.getPath() + "/done", bSelected);
//       },

//       //função para adicionar tarefa ao pressionar Enter
//       onInputSubmit: function () {
//         this.onAddTask();
//       },

//       //função para limpar tarefa correspondente ao id
//       onClearTasks: function (oEvent) {
//         var oModel = this.getView().getModel();
//         var aTasks = oModel.getProperty("/tasks");
//         var sTaskId = oEvent.getSource().getBindingContext().getProperty("id");

//         sap.m.MessageBox.show("Deseja realmente excluir esta tarefa?", {
//           title: "Confirmação",
//           actions: ["Sim", "Não"],

//           onClose: function (oAction) {
//             if (oAction === "Sim") {
//               var aFiltered = aTasks.filter(function (task) {
//                 return task.id !== sTaskId;
//               });
//               oModel.setProperty("/tasks", aFiltered);
//             }
//           },
//         });
//       },
//     });
//   }
// );

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
  ],
  function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("todolist.controller.todo", {
      onInit: function () {
        // modelo inicial com tarefas
        var oData = {
          tasks: [
            { id: 1, title: "Estudar SAPUI5", done: false, tag: "Alta", date: "20/12/2024" },
            { id: 2, title: "Criar To-Do List", done: false, tag: "Média", date: "22/12/2024" },
          ],
        };
        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel);

        // modelo de KPIs
        var oKpiModel = new JSONModel({ late: 0, today: 0, tomorrow: 0 });
        this.getView().setModel(oKpiModel, "kpiModel");

        // calcula KPIs na inicialização
        this._updateKpis();

        // data mínima para o datepicker
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var oDateModel = new JSONModel({ ui5date: today });
        this.getView().setModel(oDateModel, "dateModel");
      },

      // adicionar tarefa
      onAddTask: function () {
        var oView = this.getView();
        var sValue = oView.byId("newTaskInput").getValue();
        var sTag = oView.byId("prioritySelect").getSelectedItem()
          ? oView.byId("prioritySelect").getSelectedItem().getText()
          : "";

          console.log(sTag)
        var sDate = oView.byId("taskDatePicker").getDateValue()
          ? oView.byId("taskDatePicker").getDateValue().toLocaleDateString()
          : "";

        var oDatePicker = oView.byId("taskDatePicker");
        if (!sDate) {
          oDatePicker.setValueState("Error");
          oDatePicker.setValueStateText("Preencha a data de abertura do chamado.");
          return;
        } else {
          oDatePicker.setValueState("None");
        }

        if (sValue) {
          var oModel = oView.getModel();
          var aTasks = oModel.getProperty("/tasks");
          aTasks.push({
            id: Date.now(),
            title: sValue,
            done: false,
            tag: sTag,
            date: sDate,
          });
          oModel.setProperty("/tasks", aTasks);

          // limpa campos
          oView.byId("newTaskInput").setValue("");
          oView.byId("prioritySelect").setSelectedKey("low");
          oDatePicker.setValue("");

          // atualiza KPIs
          this._updateKpis();
        }
      },

      // marcar/desmarcar tarefa
      onToggleTask: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext();
        var bSelected = oEvent.getParameter("selected");
        oContext.getModel().setProperty(oContext.getPath() + "/done", bSelected);

        // atualiza KPIs
        this._updateKpis();
      },

      // limpar tarefa
      onClearTasks: function (oEvent) {
        var oModel = this.getView().getModel();
        var aTasks = oModel.getProperty("/tasks");
        var sTaskId = oEvent.getSource().getBindingContext().getProperty("id");

        MessageBox.show("Deseja realmente excluir esta tarefa?", {
          title: "Confirmação",
          actions: ["Sim", "Não"],
          onClose: function (oAction) {
            if (oAction === "Sim") {
              var aFiltered = aTasks.filter(function (task) {
                return task.id !== sTaskId;
              });
              oModel.setProperty("/tasks", aFiltered);

              // atualiza KPIs
              this._updateKpis();
            }
          }.bind(this),
        });
      },

      // adicionar tarefa com Enter
      onInputSubmit: function () {
        this.onAddTask();
      },

      /**
       * Atualiza KPIs (atrasadas, hoje, amanhã)
       */
      _updateKpis: function () {
        var aTasks = this.getView().getModel().getProperty("/tasks");
        var oKpiData = { late: 0, today: 0, tomorrow: 0 };

        var today = new Date();
        today.setHours(0, 0, 0, 0);

        var tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        aTasks.forEach(function (task) {
          // converte dd/mm/yyyy para Date
          var parts = task.date.split("/");
          var taskDate = new Date(parts[2], parts[1] - 1, parts[0]);
          taskDate.setHours(0, 0, 0, 0);

          // flags auxiliares
          task.isLate = !task.done && taskDate < today;
          task.isToday = !task.done && taskDate.getTime() === today.getTime();
          task.isTomorrow = !task.done && taskDate.getTime() === tomorrow.getTime();

          // KPIs
          if (task.isLate) {
            oKpiData.late++;
          } else if (task.isToday) {
            oKpiData.today++;
          } else if (task.isTomorrow) {
            oKpiData.tomorrow++;
          }
        });

        this.getView().getModel("kpiModel").setData(oKpiData);
        this.getView().getModel().refresh(true);
      },

      /**
       * Formatter para aplicar classe CSS nas tarefas
       */
      formatTaskClass: function (bDone, bLate) {
        if (bDone) {
          return "taskDone";
        }
        if (bLate) {
          return "taskLate";
        }
        return "";
      },

      statusState: function(sTag) {
        switch (sTag) {
          case "Crítica":
            return "Error"
          case "Alta":
            return "Error";
          case "Média":
            return "Warning";
          case "Baixa":
            return "Success";
          default:
            return "None";
        }
      }
    });
  }
);
