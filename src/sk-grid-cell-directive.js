/**
 * Created by karsa007 on 1/9/2017.
 */
skGrid.directive('skGridCell', [
    '$compile',
    '$sce',
    'SKGridUtilityService',
    function ($compile, $sce, SKGridUtilityService) {
        return {
            restrict: 'A',
            scope: {
                column: "=",
                row: "="
            },
            template: '<div ng-include="dynamicTemplateUrl"></div>',
            link: function (scope, elem, attr) {
                scope.editModeOn = false;
                scope.editable = scope.column.edit ? true : false;
                scope.allowEditCell = function(){
                    if(scope.editable){
                        scope.editModeOn = true;
                    }
                };

                scope.saveValue = function(editValue){
                    SKGridUtilityService.setCell(scope.column.field)(scope.row, editValue);
                    scope.editModeOn = false;
                };

                scope.$watch('editModeOn', function(newVal){
                    if(newVal){
                        scope.editValue = SKGridUtilityService.getCell(scope.column.field)(scope.row);
                        scope.dynamicTemplateUrl = 'sk-grid-cell-edit';
                    }
                    else{
                        delete scope.editValue;
                        scope.dynamicTemplateUrl = 'sk-grid-cell-view';
                    }
                });

                scope.cellRenderer = function(column, row){
                    scope.value = SKGridUtilityService.getCell(column.field)(row);
                    if(column.cellRenderer !== undefined){
                        if(typeof column.cellRenderer === "function"){
                            //TODO: should this value be returned as blank if it is null?
                            var html = column.cellRenderer(scope.value, row);
                            var compiled = $compile(html)(scope);
                            var finalHtml = '';
                            angular.forEach(compiled, function(o){
                                finalHtml += o.outerHTML;
                            });
                            return $sce.trustAsHtml(finalHtml);
                        }
                    }
                    else{
                        return scope.value ? $sce.trustAsHtml(scope.value.toString()) : '';
                    }
                };

            }
        };
}]);
