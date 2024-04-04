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

        return Controller.extend("myproject.controller.Detail", {
            onInit: function () {
                var oViewModel = new JSONModel({
                    busy: true,
                    delay: 0,
                    editable: false,
                    DELETED_LEVEL: this.DELETED_LEVEL});
                this.getRouter().getRoute("TargetView1").attachPatternMatched(this._onObjectMatched, this);
                this.setModel(oViewModel, "detailView");
            },
            setModel : function (oModel, sName) {
                return this.getView().setModel(oModel, sName);
            },
            getModel : function (sName) {
                return this.getView().getModel(sName);
            },
            getRouter : function () {
                return this.getOwnerComponent().getRouter();
            }
        });
    });