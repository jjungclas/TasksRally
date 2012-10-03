Ext.define('TasksApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    _activeFilters: [{
        property: 'State',
        operator: '<',
        value: 'Completed'
    }],
    _filterGrid: function() {
        this.grid.store.clearFilter(true);
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
    _iterationSelected: function(comboBox, records) {
        var iterationFilter = {
            property: 'Iteration',
            value: records[0].get("_ref")
        };

        this._addFilter(iterationFilter);
        this._filterGrid();
    },
    _ownerSelected: function(comboBox, records) {
        var ownerFilter = {
            property: 'Owner',
            value: records[0].get("_ref")
        };

        this._addFilter(ownerFilter);
        this._filterGrid();
    },
    _resetFilters: function() {
        this._activeFilters = [this._activeFilters[0]];
        this._clearFilterInputs();
        this._filterGrid();
    },
    _clearFilterInputs: function() {
        Ext.getCmp('ownerComboBox').reset();
        Ext.getCmp('iterationComboBox').reset();
        Ext.getCmp('releaseComboBox').reset();
    },
    launch: function launch() {
        Rally.data.ModelFactory.getModel({
            type: 'Task',
            scope: this,
            success: function(model) {
                var project = Rally.environment.getContext().getProject().ObjectID;

                var me = this;
                var clearFiltersStoreConfig = {
                  listeners:{
                   load:function(){
                    me._clearFilterInputs();   
                   }
                  }
                };
                var filterContainer = {
                    width: 1000,
                    xtype: 'container',
                    cls: 'filter-container',
                    layout: {
                        type: 'hbox'
                    },
                    items: [{
                        xtype: 'container',
                        items: [{
                            xtype: 'button',
                            text: 'Reset Filters',
                            handler: Ext.bind(this._resetFilters, this)
                        }],
                        flex: 1
                    }, , {
                        id: 'releaseComboBox',
                        xtype: 'rallyreleasecombobox',
                        fieldLabel: "Release",
                        autoSelect: false,
                        labelWidth: 45,
                        listConfig: {
                            minWidth: 90,
                            width: 90,
                            itemTpl: new Ext.XTemplate('<div class="timebox-name<tpl if="isSelected"> timebox-item-selected</tpl>">{formattedName}</div>')
                        },
                        storeConfig: clearFiltersStoreConfig,
                        listeners: {
                            select: Ext.bind(this._releaseSelected, this)
                        },
                        flex: 1
                    }, {
                        id: 'iterationComboBox',
                        xtype: 'rallyiterationcombobox',
                        fieldLabel: "Iteration",
                        labelWidth: 45,
                        listConfig: {
                            minWidth: 90,
                            width: 90,
                            itemTpl: new Ext.XTemplate('<div class="timebox-name<tpl if="isSelected"> timebox-item-selected</tpl>">{formattedName}</div>')
                        },
                        storeConfig: clearFiltersStoreConfig,
                        listeners: {
                            select: Ext.bind(this._iterationSelected, this)
                        },
                        flex: 1
                    }, {
                        id: 'ownerComboBox',
                        labelWidth: 45,
                        xtype: 'rallyusercombobox',
                        fieldLabel: 'Owner',
                        project: '/project/' + project,
                        storeConfig: clearFiltersStoreConfig,
                        listeners: {
                            select: Ext.bind(this._ownerSelected, this)
                        },
                        flex: 1
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
