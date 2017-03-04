module.exports = function(classType) {
    return function(val) {
        return val && val instanceof classType;
    }
}
