/**
 * Created by karsa007 on 12/30/2016.
 */
skGrid.directive('skGrid', [
    'SKGridUtilityService',
    function (SKGridUtilityService) {
    return {
        restrict: 'A',
        scope: {
            skGrid: "="
        },
        templateUrl: "sk-grid",
        link: function(scope, elem, attr) {
            scope.skGrid.$$columns = [];
            scope.skGrid.$$rows = [];
            scope.skGrid.$$oldData = angular.copy(scope.skGrid.data);
            var sortables = [];
            //angular.extend(scope.gridOptions, scope.skGrid);

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
                        scope.skGrid.$$columns.push(col);
                    }
                });
            };

            //data grid setup
            var buildRows = function(rows, columns, parent){
                angular.forEach(rows, function(row){
                    if(parent){
                        row.$$parent = parent;
                    }
                    scope.skGrid.$$rows.push(row);
                    angular.forEach(columns, function(col){
                        if(col.children && col.children.length > 0){
                            buildRows(row[col.field], col.children, row);
                        }
                    });
                });
            };

            var buildGrid = function(data){
                scope.skGrid.$$columns = [];
                scope.skGrid.$$rows = [];
                buildCols(scope.skGrid.colDef);
                data = _.sortBy(data, sortables);
                buildRows(angular.copy(data), scope.skGrid.colDef, null);
            };

            buildGrid(scope.skGrid.data);

            scope.skGrid.api = {
                addRow: function(row, index){
                    if(index !== undefined && typeof index === "number"){
                        scope.skGrid.data.splice(parseInt(index), 0, row);
                    }
                    else{
                        scope.skGrid.data.push(row);
                    }
                    buildGrid(scope.skGrid.data);
                },
                addChildren: function(data, parent, index){
                    //TODO:consider n-th level children
                },
                getSelectedRows: function(){
                    if(scope.skGrid.selection){

                    }
                    else{
                        throw {name : "SKGridSelectionNotEnabledError", message : "Selection option not enabled"};
                    }
                }
            };

            scope.checkCellDisplayCondition = function(rowIdx, colIdx){
                var row = scope.skGrid.$$rows[rowIdx];
                var col = scope.skGrid.$$columns[colIdx];

                if(SKGridUtilityService.getCell(col.field)(row) === undefined){
                    return false;
                }
                if(col.groupLevel != undefined){
                    if(rowIdx > 0 && scope.skGrid.$$rows[rowIdx-1] && SKGridUtilityService.getCell(col.field)(row) == SKGridUtilityService.getCell(col.field)(scope.skGrid.$$rows[rowIdx-1])){
                        return false;
                    }
                }
                return true;
            };

            //selection
            if(scope.skGrid.selection){
                scope.checkSelectAll = function(rowIdx, row){
                    var selectedRowsCount = 0;
                    angular.forEach(scope.skGrid.$$rows, function(r){
                        if(r.$$selected){
                            selectedRowsCount++;
                        }
                    });

                    if(selectedRowsCount == scope.skGrid.$$rows.length){
                        scope.skGrid.$$selectAll = true;
                    }
                    else{
                        scope.skGrid.$$selectAll = false;
                    }
                };

                scope.selectAllRows = function(){
                    if(scope.skGrid.$$selectAll){
                        angular.forEach(scope.skGrid.$$rows, function(r){
                            r.$$selected = true;
                        });
                    }
                    else{
                        angular.forEach(scope.skGrid.$$rows, function(r){
                            r.$$selected = false;
                        });
                    }
                };

                scope.skGrid.selectChild = scope.skGrid.selectChild !== undefined ? scope.skGrid.selectChild : false;

                scope.checkRowSelectable = function(row){
                    if(row.$$parent && !scope.skGrid.selectChild){
                        return false;
                    }
                    return true;
                };
            }

            console.log(scope.skGrid);
        }
    }
}]);