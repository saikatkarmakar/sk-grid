/**
 * Created by karsa007 on 1/9/2017.
 */
magnusNgGrid.directive('magnusGridCell', [
    '$compile',
    '$sce',
    'MagnusGridUtilityService',
    function ($compile, $sce, MagnusGridUtilityService) {
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
                        scope.editValue = MagnusGridUtilityService.field(scope.column.field, scope.row);
                    }
                };

                scope.saveValue = function(editValue){
                    MagnusGridUtilityService.setField(scope.column.field, scope.row, editValue);
                    console.log('Saved in object:', editValue);
                    scope.editModeOn = false;
                };

                scope.$watch('editModeOn', function(newVal){
                    if(newVal){
                        scope.dynamicTemplateUrl = 'magnus-grid-cell-edit';
                    }
                    else{
                        scope.dynamicTemplateUrl = 'magnus-grid-cell-view';
                    }
                });

                scope.cellRenderer = function(column, row){
                    var value = MagnusGridUtilityService.field(column.field, row);
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
