sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/f/LayoutType",
    "sap/m/MessageToast",    
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
	JSONModel,
	LayoutType,
	MessageToast,
	UIComponent) {
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
            },
            _onObjectMatched : function (oEvent) {
                var sObjectId = oEvent.getParameter("arguments").column;
                var sLayout = sObjectId ? LayoutType.TwoColumnsMidExpanded : LayoutType.OneColumn;
                this.getModel("myLayout").setProperty("/layout", sLayout);
                this.getModel("detailView").setProperty("/editable", false);

                if (!sObjectId) return;
                this._product = oEvent.getParameter("arguments") || this._product || "0";

                var oViewModel = this.getModel("detailView");
                this.getView().bindElement({
                    path: "testData/" + this._product.objectId,
                    model:"testData",
                    events: {
                        change: this._onBindingChange.bind(this),
                        dataRequested: function () {
                            oViewModel.setProperty("/busy", true);
                        },
                        dataReceived: function () {
                            oViewModel.setProperty("/busy", false);
                        }
                    }
                })
            },
            onBindingChange : function () {
                var oViewModel = this.getModel("detailView");
                var oElementBinding = this.getView().getElementBinding();
                oViewModel.setProperty("/busy", false);
            },
            onClose:function(){
                this.getModel("myLayout").setProperty("/layout", LayoutType.OneColumn);
                this.getRouter().navTo("TargetView1");
            }
        });
    });
