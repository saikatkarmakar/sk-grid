/**
 * Created by karsa007 on 12/30/2016.
 */
magnusNgGrid.directive('magnusGrid', [
    'MagnusGridUtilityService',
    function (MagnusGridUtilityService) {
    return {
        restrict: 'A',
        scope: {
            magnusGrid: "="
        },
        templateUrl: function(element, attrs) {
            var listType = attrs.listType ? attrs.listType : 'flat';
            switch (listType){
                case 'flat':
                    return "magnus-grid-flat-list";
                case 'group':
                    return "magnus-grid-group-list";
            }
        },
        link: function(scope, elem, attr) {
            scope.magnusGrid.$$columns = [];
            scope.magnusGrid.$$rows = [];
            scope.magnusGrid.$$oldData = angular.copy(scope.magnusGrid.data);
            var sortables = [];
            //angular.extend(scope.gridOptions, scope.magnusGrid);

            //header setup
            var buildCols = function(cols){
                angular.forEach(cols, function(col, key){
                    if(col.children && col.children.length > 0){
                        buildCols(col.children);
                    }
                    else{
                        if(col.groupLevel != undefined){
                            sortables.push(col.field);
                        }
                        scope.magnusGrid.$$columns.push(col);
                    }
                });
            };

            //data grid setup
            var buildRows = function(rows, columns, parent){
                angular.forEach(rows, function(row){
                    if(parent){
                        row.$$parent = parent;
                    }
                    scope.magnusGrid.$$rows.push(row);
                    angular.forEach(columns, function(col){
                        if(col.children && col.children.length > 0){
                            buildRows(row[col.field], col.children, row);
                        }
                    });
                });
            };

            var buildGrid = function(data){
                scope.magnusGrid.$$columns = [];
                scope.magnusGrid.$$rows = [];
                buildCols(scope.magnusGrid.colDef);
                data = _.sortBy(data, sortables);
                buildRows(angular.copy(data), scope.magnusGrid.colDef, null);
            };

            buildGrid(scope.magnusGrid.data);

            scope.magnusGrid.api = {
                addRow: function(row, index){
                    if(index !== undefined && typeof index === "number"){
                        scope.magnusGrid.data.splice(parseInt(index), 0, row);
                    }
                    else{
                        scope.magnusGrid.data.push(row);
                    }
                    buildGrid(scope.magnusGrid.data);
                },
                addChildren: function(data, parent, index){
                    //TODO:consider n-th level children
                },
                getSelectedRows: function(){
                    if(scope.magnusGrid.selection){

                    }
                    else{
                        throw {name : "MagnusGridSelectionNotEnabledError", message : "Selection option not enabled"};
                    }
                }
            };

            scope.checkCellDisplayCondition = function(rowIdx, colIdx){
                var row = scope.magnusGrid.$$rows[rowIdx];
                var col = scope.magnusGrid.$$columns[colIdx];

                if(MagnusGridUtilityService.field(col.field, row) === undefined){
                    return false;
                }
                if(col.groupLevel != undefined){
                    if(rowIdx > 0 && scope.magnusGrid.$$rows[rowIdx-1] && MagnusGridUtilityService.field(col.field, row) == MagnusGridUtilityService.field(col.field, scope.magnusGrid.$$rows[rowIdx-1])){
                        return false;
                    }
                }
                return true;
            };

            //selection
            if(scope.magnusGrid.selection){
                scope.checkSelectAll = function(rowIdx, row){
                    var selectedRowsCount = 0;
                    angular.forEach(scope.magnusGrid.$$rows, function(r){
                        if(r.$$selected){
                            selectedRowsCount++;
                        }
                    });

                    if(selectedRowsCount == scope.magnusGrid.$$rows.length){
                        scope.magnusGrid.$$selectAll = true;
                    }
                    else{
                        scope.magnusGrid.$$selectAll = false;
                    }
                };

                scope.selectAllRows = function(){
                    if(scope.magnusGrid.$$selectAll){
                        angular.forEach(scope.magnusGrid.$$rows, function(r){
                            r.$$selected = true;
                        });
                    }
                    else{
                        angular.forEach(scope.magnusGrid.$$rows, function(r){
                            r.$$selected = false;
                        });
                    }
                };

                scope.magnusGrid.selectChild = scope.magnusGrid.selectChild !== undefined ? scope.magnusGrid.selectChild : false;

                scope.checkRowSelectable = function(row){
                    if(row.$$parent && !scope.magnusGrid.selectChild){
                        return false;
                    }
                    return true;
                };


            }

            console.log(scope.magnusGrid);
        }
    }
}]);