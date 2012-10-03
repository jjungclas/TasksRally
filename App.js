Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

	launch: function launch() {
		Rally.data.ModelFactory.getModel({
			type: 'Task',
			scope: this,
			success: function (model) {
				this.grid = this.add({
					xtype: 'rallygrid',
					model: model,
					columnCfgs: [
						'FormattedID',
						'Name',
						'WorkProduct',
						'Owner',
						'Release',
						'Iteration',
						// 'Workspace',
						'Project'
					],
					storeConfig: {
						context: {
							projectScopeUp: false,
							projectScopeDown: true
						},
						filters: [
							{
								property: 'State',
								operator: '<',
								value: 'Completed'
							}
						]
					}
				});
			}
		});
	},


});
