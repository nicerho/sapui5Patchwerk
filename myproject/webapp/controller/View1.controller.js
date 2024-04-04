sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/f/library",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,library,MessageToast,UIComponent) {
        "use strict";

        return Controller.extend("myproject.controller.View1", {
            onInit: function () {
                this.setModel(new JSONModel({layout: library.LayoutType.OneColumn,}),"myLayout");
            },
            setModel : function (oModel, sName) {
                return this.getView().setModel(oModel, sName);
            },
            getModel : function (sName) {
                return this.getView().getModel(sName);
            },
            getRouter : function () {
                return this.getOwnerComponent().getRouter();
            },
            onPress: function (oEvent) {
                var oItem = oEvent
                  .getSource()
                  .getBindingContext("testData")
                  .getPath()
                  .split("/")
                  .slice(-1)
                  .pop();
                             
                this.getRouter().navTo("TargetView1", { column: oItem });
              }
        });
    });
