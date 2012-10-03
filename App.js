Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    _activeFilters: [
//        {
//        property: 'State',
//        operator: '<',
//        value: 'Completed'
//    }
    ],
    _filterGrid: function() {
        this.grid.store.clearFilter();
        this.grid.store.filter(this._activeFilters);
    },
    _addFilter: function(filter) {
        var existingIndex = -1;
        Ext.Array.forEach(this._activeFilters, function(existingFilter, index) {
            if (existingFilter.property === filter.property) {
                existingIndex = index;
            }
        });

        if (existingIndex !== -1) {
            //remove existing filter
            this._activeFilters.splice(existingIndex, 1);
        }

        //always add new filter
        this._activeFilters.push(filter);
    },
    _releaseSelected: function(comboBox, records) {
        var releaseFilter = {
            property: 'Release',
            value: records[0].get("_ref")
        };

        this._addFilter(releaseFilter);
        this._filterGrid();
    },
    _iterationSelected: function(comboBox,records){
        var iterationFilter = {
            property: 'Iteration',
            value: records[0].get("_ref")
        };

        this._addFilter(iterationFilter);
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
                        fieldLabel: "Iteration",
                        listeners: {
                            select: Ext.bind(this._iterationSelected, this)
                        }
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
                        filters: this._activeFilters
                    }

                });

            }
        });
    },


});
