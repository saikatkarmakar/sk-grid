/**
 * Created by karsa007 on 1/9/2017.
 */
skGrid.factory('SKGridUtilityService', [function() {
    return {
        field: function(fld, obj){
            var index = function(obj,i) {
                return obj && obj[i] ? obj[i] : null;
            };
            return fld.split('.').reduce(index, obj);
        },
        setField: function(fld, obj, val){
            eval("")
            var keys = fld.split('.');
            var temp = {};
            /*for(var i = 0; i < keys.length; i++){
                temp[keys[i]] = keys[i+1];
            }*/
            angular.forEach(keys, function(e){
                //temp[e] = e.next();
            })
            //a[attrVal][type][code] = val
            //"attrVal.type.code"
            //obj.attrVal.type.code
            //obj[keys[0]][keys[1]][keys[2]] = val;
        }
    }
}]);