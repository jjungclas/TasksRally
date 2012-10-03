Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    _activeFilters: [
        {
        property: 'State',
        operator: '<',
        value: 'Completed'
    }
    ],
    _filterGrid: function() {
        this.grid.store.clearFilter();
        this.grid.store.filter(this._activeFilters);
    },
    _releaseSelected: function(comboBox, records) {
        var release = records[0].get("_ref");

        var releaseFilter = {
            property: 'Release',
            value: release
        };

        this._activeFilters.push(releaseFilter);
        this._filterGrid();
    },
    launch: function launch() {
        Rally.data.ModelFactory.getModel({
            type: 'Task',
            scope: this,
            success: function(model) {
                var project = Rally.environment.getContext().getProject().ObjectID;

                var filterContainer = {
                    xtype: 'container',
                    layout: {
                        type: 'hbox'
                    },
                    items: [{
                        xtype: 'rallyreleasecombobox',
                        fieldLabel: "Release",
                        listeners: {
                            select: Ext.bind(this._releaseSelected, this)
                        }
                    }, {
                        xtype: 'rallyiterationcombobox',
                        fieldLabel: "Iteration"
                    }, {
                        xtype: 'rallyusercombobox',
                        fieldLabel: 'Owner',
                        project: '/project/' + project
                    }]
                };

                this.add(filterContainer);
                this.grid = this.add({
                    xtype: 'rallygrid',
                    model: model,
                    columnCfgs: ['FormattedID', 'Name', 'WorkProduct', 'Owner', 'Release', 'Iteration',
                    // 'Workspace',
                    'Project'],
                    storeConfig: {
                        context: {
                            projectScopeUp: false,
                            projectScopeDown: true
                        },
                        filters:this._activeFilters
                    }
                    
                });

            }
        });
    },


});
