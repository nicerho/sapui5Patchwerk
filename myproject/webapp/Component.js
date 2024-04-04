/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "myproject/model/models",
        "sap/ui/core/library",
        "sap/ui/core/routing/History",
        "sap/ui/model/resource/ResourceModel",
        "sap/ui/model/json/JSONModel"
        
    ],
    function (UIComponent, Device, models,library,History,ResourceModel,JSONModel) {
        "use strict";

        return UIComponent.extend("myproject.Component", {
            metadata: {
                manifest: "json",
                interfaces: [library.IAsyncContentCreation]
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            },
            getContentDensityClass: function () {
                if (!this._sContentDensityClass) {
                    if (!Device.support.touch){
                        this._sContentDensityClass = "sapUiSizeCompact";
                    } else {
                        this._sContentDensityClass = "sapUiSizeCozy";
                    }
                }
                return this._sContentDensityClass;
            }
        });
    }
);