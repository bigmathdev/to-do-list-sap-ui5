sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "todolist/model/TaskPersistenceModel",
  ],
  function (Controller, JSONModel, MessageBox, TaskPersistenceModel) {
    "use strict";

    return Controller.extend("todolist.controller.todo", {
      // inicialização do controller
      onInit: function () {
        // carrega tarefas do armazenamento local
        var aTasks = TaskPersistenceModel.loadTasks();
        var oData = {
          tasks:
            aTasks && aTasks.length
              ? aTasks
              : [
                  {
                    id: 1,
                    title: "Exemplo de tarefa",
                    done: false,
                    tag: "Baixa",
                    date: "21/12/2024",
                  },
                  {
                    id: 2,
                    title: "Criar To-Do List",
                    done: false,
                    tag: "Média",
                    date: "22/12/2024",
                  },
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
        var sValue = oView.byId("newTaskInput").getValue().trim();
        var sTag = oView.byId("prioritySelect").getSelectedItem()
          ? oView.byId("prioritySelect").getSelectedItem().getText()
          : "";
        var sDate = oView.byId("taskDatePicker").getDateValue()
          ? oView.byId("taskDatePicker").getDateValue().toLocaleDateString()
          : "";

        var oDatePicker = oView.byId("taskDatePicker");

        // validação dos campos
        var bTextEmpty = !sValue;
        var bDateEmpty = !sDate;
        if (bTextEmpty || bDateEmpty) {
          sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
            if (bTextEmpty) {
              MessageToast.show("Digite uma descrição para a tarefa.");
              oView.byId("newTaskInput").setValueState("Error");
              oView
                .byId("newTaskInput")
                .setValueStateText("Campo obrigatório.");
            } else {
              oView.byId("newTaskInput").setValueState("None");
            }
            if (bDateEmpty) {
              setTimeout(
                function () {
                  MessageToast.show("Preencha a data de abertura do chamado.");
                  oDatePicker.setValueState("Error");
                  oDatePicker.setValueStateText(
                    "Preencha a data de abertura do chamado."
                  );
                },
                bTextEmpty ? 1000 : 0
              );
            } else {
              oDatePicker.setValueState("None");
            }
          });
          return;
        }

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
        TaskPersistenceModel.saveTasks(aTasks);

        // limpa campos e reseta estado dos inputs
        var oInput = oView.byId("newTaskInput");
        oInput.setValue("");
        oInput.setValueState("None");
        oInput.setValueStateText("");
        oView.byId("prioritySelect").setSelectedKey("low");
        oDatePicker.setValue("");
        oDatePicker.setValueState("None");
        oDatePicker.setValueStateText("");

        // atualiza KPIs
        this._updateKpis();

        // toast de sucesso
        sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
          MessageToast.show("Tarefa adicionada com sucesso!");
        });
      },

      // marcar e desmarcar tarefa
      onToggleTask: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext();
        var bSelected = oEvent.getParameter("selected");
        oContext
          .getModel()
          .setProperty(oContext.getPath() + "/done", bSelected);

        // salva tarefas após alteração
        var aTasks = oContext.getModel().getProperty("/tasks");
        TaskPersistenceModel.saveTasks(aTasks);

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
              TaskPersistenceModel.saveTasks(aFiltered);

              sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
                MessageToast.show("Tarefa excluída com sucesso!");
              });

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

      // Limpar todas as tarefas
      onClearAllTasks: function () {
        var oModel = this.getView().getModel();
        oModel.setProperty("/tasks", []);
        TaskPersistenceModel.clearTasks();
        this._updateKpis();
        sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
          MessageToast.show("Todas as tarefas foram removidas!");
        });
      },

      //atualiza KPIs (atrasadas, hoje, amanhã)
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
          task.isTomorrow =
            !task.done && taskDate.getTime() === tomorrow.getTime();

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

      // retorna o estado visual para a tag de prioridade
      getTagState: function (sTag) {
        switch (sTag) {
          case "Baixa":
            return "Success";
          case "Média":
            return "Warning";
          case "Alta":
          case "Crítica":
            return "Error";
          default:
            return "None";
        }
      },

      getTagIcon: function (sTag) {
        switch (sTag) {
          case "Baixa":
            return "sap-icon://message-success";
          case "Média":
            return "sap-icon://message-warning";
          case "Alta":
            return "sap-icon://alert";
          case "Crítica":
            return "sap-icon://error";
          default:
            return "";
        }
      },
    });
  }
);
