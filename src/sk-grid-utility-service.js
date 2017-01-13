/**
 * Created by karsa007 on 1/9/2017.
 */
skGrid.factory('SKGridUtilityService', [function() {
    return {
        setCell: function(field){
            return new Function("obj", "newval", "try{ obj." + field + " = newval;}"+
            "catch(e){ console.error(e);}");
        },
        getCell: function(field){
            return new Function("obj", "try{ return obj." + field + ";}"+
            "catch(e){ return undefined;}");
        }
    }
}]);