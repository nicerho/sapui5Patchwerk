sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment"
], function(Controller, UIComponent,History, Fragment) {
	"use strict";

	return Controller.extend("myproject.controller.BaseController", {

		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Returns a promises which resolves with the resource bundle value of the given key <code>sI18nKey</code>
		 *
		 * @public
		 * @param {string} sI18nKey The key
		 * @param {sap.ui.core.model.ResourceModel} oResourceModel The resource model
		 * @param {string[]} [aPlaceholderValues] The values which will repalce the placeholders in the i18n value
		 * @returns {Promise<string>} The promise
		 */
		getBundleTextByModel: function(sI18nKey, oResourceModel, aPlaceholderValues){
			return oResourceModel.getResourceBundle().then(function(oBundle){
				return oBundle.getText(sI18nKey, aPlaceholderValues);
			});
		},
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);

			} else {
				this.getRouter().navTo("dndn", {}, true);
			}
		},

		_callAjax: async function({
			data,
			url,
			type = "POST",
		}) {
			try {
				var sBaseURL = this.getOwnerComponent().getModel("config").getProperty("/baseURL");
				
				const goBack = () => {
					sessionStorage.clear();
					location.href="/view/outer/login.html";
					return;
				};
	
				let options = {
					method: type,
					headers: {
						'Authorization' : `Bearer ${sessionStorage.getItem('token')}`,
						'Content-Type': 'application/json;charset=utf-8',
					},
				};
	
				if(type === 'POST' || type === 'post') {
					options.body = JSON.stringify(data ? data : {});
				}

				let requestURL = `${sBaseURL}${url.startsWith('/') ? url.slice(1) : url}`;

				if(type === 'GET' || type==='get') {
					if(data) {
						let queryString = "?";
						for(const [key, value] of Object.entries(data)) {
							queryString += `${key}=${value}&`;
						}
						if(queryString[queryString.length - 1] === "&") {
							queryString = queryString.slice(0, -1);
						}
						requestURL = requestURL + queryString;
					}
				}
				
				
				let response = await fetch(requestURL, options);
				let json = await response.json();
				let status = json.status;
				let msg = json.message;
	
				if(status !== 'SUCCESS') {
					//alert(msg);
					if(json.data && json.data.redirect_back) {
						goBack();
						return;
					}
				}
				// pass logics
				return json;
			} catch (error) {
				return error;
			}
		},

		_dialogOpen : async function({
			dialogName, /*다이로그 이름 */
			onlyOneInitFunc, /* 첫번째 생성 시 실행할 함수 */
			initFunc, /* 이후에 게속 창이 열릴 때마다 실행할 함수 */
		}) {

			if((onlyOneInitFunc && typeof onlyOneInitFunc !== "function") || (initFunc && typeof initFunc !== "function")) {
				return false;
			}

			if(typeof dialogName !== 'string') {
				return false;
			}

			let oView = this.getView();

			if(!this._oDialog) {
				this._oDialog = {};
			}

			if(!this._oDialog[dialogName]) {
				let oDialog = await Fragment.load({
					id: oView.getId(),
					name: `sap.ui.demo.toolpageapp.view.fragment.${dialogName}`,
					controller: this});

				oView.addDependent(oDialog);
				this._oDialog['AuthRegDialog'] = oDialog;
				oDialog.open();
				if(onlyOneInitFunc) {
					if(onlyOneInitFunc.constructor.name === 'AsyncFunction') {
						await onlyOneInitFunc(oDialog, this);
					} else {
						onlyOneInitFunc(oDialog, this);
					}
				}
				if(initFunc) {
					if(initFunc.constructor.name === 'AsyncFunction') {
						await initFunc(oDialog, this);
					} else {
						initFunc(oDialog, this);
					}
					
				}
				if(initFunc) {
					initFunc(oDialog, this);
				}
			} else {
				let oDialog = this._oDialog['AuthRegDialog'];
				oDialog.open();
				if(initFunc) {
					if(initFunc.constructor.name === 'AsyncFunction') {
						await initFunc(oDialog, this);
					} else {
						initFunc(oDialog, this);
					}
				}
			}

			return true;
		},

		_DialogOpenSimple : async function(
			dialogName /*다이로그 이름 */
		) {

			if(typeof dialogName !== 'string') {
				return null;
			}

			let oView = this.getView();

			if(!this._oDialog) {
				this._oDialog = {};
			}

			if(!this._oDialog[dialogName]) {
				this._oDialog['AuthRegDialog']  = await Fragment.load({
					id: oView.getId(),
					name: `sap.ui.demo.toolpageapp.view.fragment.${dialogName}`,
					controller: this});

				oView.addDependent(this._oDialog['AuthRegDialog']);
			} 

			return this._oDialog[dialogName];
		},
	});

});