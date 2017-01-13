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
                        scope.editValue = SKGridUtilityService.getCell(scope.column.field)(scope.row);
                    }
                };

                scope.saveValue = function(editValue){
                    SKGridUtilityService.setCell(scope.column.field)(scope.row, editValue);
                    var field = SKGridUtilityService.getCell(scope.column.field)(scope.row);
                    console.log('Saved in object:', editValue);
                    scope.editModeOn = false;
                };

                scope.$watch('editModeOn', function(newVal){
                    if(newVal){
                        scope.dynamicTemplateUrl = 'sk-grid-cell-edit';
                    }
                    else{
                        scope.dynamicTemplateUrl = 'sk-grid-cell-view';
                    }
                });

                scope.cellRenderer = function(column, row){
                    var value = SKGridUtilityService.getCell(column.field)(row);
                    if(column.cellRenderer !== undefined){
                        if(typeof column.cellRenderer === "function"){
                            //TODO: should this value be returned as blank if it is null?
                            var html = column.cellRenderer(value ? value : '', row);
                            var compiled = $compile(html)(scope);
                            var finalHtml = '';
                            angular.forEach(compiled, function(o){
                                finalHtml += o.outerHTML;
                            });
                            return $sce.trustAsHtml(finalHtml);
                        }
                    }
                    else{
                        return value ? $sce.trustAsHtml(value.toString()) : '';
                    }
                };

            }
        };
}]);
