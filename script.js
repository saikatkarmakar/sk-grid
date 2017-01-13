/**
 * Created by karsa007 on 12/30/2016.
 */
var mainApp = angular.module('mainApp', ['skGrid']);
mainApp.filter('test', function() {
    return function(value) {
        if (!value)
            return '';
        return value + ' …';
    };
});

(function(app){
    app.directive('dirTest', function() {
        return {
            restrict: 'E',
            template: '<span>DeMoDiReCtIvE</span>',
            link: function(scope){}
        }
    });
    app.controller('mainController', function($scope, $filter){
        var gData = [
            {
                promoid:5692,
                name: "demo promo 1",
                product: [
                    {
                        skuid: 112233,
                        desc: "demo prod 1"
                    },
                    {
                        skuid: 114411,
                        desc: "demo prod 2"
                    }
                ],
                attrVal: {
                    type: {
                        code: 'W13NX'
                    }
                }
            },
            {
                promoid:5697,
                name: "demo promo 2"
            },
            {
                promoid:5697,
                name: "demo promo 2"
            }
        ];

        var colDef = [
            {
                label: "Promo#",
                field: "promoid",
                headerCellClass: 'text-sm-center',
                cellClass: 'text-lg-center',
                groupLevel: 0
            },
            {
                label: "Name",
                field: "name",
                headerCellClass: 'text-sm-center',
                cellRenderer: function(value, row){
                    return '<strong>'+$filter('test')(value)+'</strong><dir-test></dir-test>';
                }
            },
            {
                label: "Type Code",
                field: "attrVal.type.code",
                headerCellClass: 'text-sm-center',
                edit: true
            },
            {
                field: "product",
                children: [
                    {
                        label: "Prod#",
                        headerCellClass: 'text-sm-center',
                        field: "skuid"
                    },
                    {
                        label: "Prod Name",
                        headerCellClass: 'text-sm-center',
                        field: "desc"
                    }
                ]
            }
        ];

        $scope.gOptions = {
            colDef: colDef,
            data: gData,
            selection: true,
            selectChild: false
        };

        $scope.addRow = function(){
            $scope.gOptions.api.addRow({
                promoid: 5694,
                name: "demo promo 3",
                /*product: [
                    {
                        skuid: 115533,
                        desc: "demo prod 5"
                    }
                ]*/
            }, 2);

            $scope.gOptions.api.getSelectedRows()
        };
    });
})(mainApp);
