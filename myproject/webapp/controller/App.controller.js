sap.ui.define(
    [
        "./BaseController",
        "sap/ui/model/json/JSONModel"
    ],
    function(BaseController,JSONModel) {
      "use strict";
  
      return BaseController.extend("myproject.controller.App", {
        onInit: function() {
          var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy : true,
				delay : 0,
				layout : "OneColumn",
				previousLayout : "",
				actionButtonsInfo : {
					midColumn : {
						fullScreen : false
					}
				}
			});
			this.setModel(oViewModel, "appView");

			fnSetAppNotBusy = function() {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};

			
        }
      });
    }
  );
  