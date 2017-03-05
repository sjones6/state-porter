let stringType = require('./types/string');
let arrayType = require('./types/array');
let booleanType = require('./types/boolean');
let numberType = require('./types/number');
let objectType = require('./types/object');
let classType = require('./types/class');
let functionType = require('./types/function');


module.exports = {
    getTypeChecker: function(type) {
        switch (type) {
            case String: 
                return stringType;
                break;
            case Array:
                return arrayType;
                break;
            case Boolean:
                return booleanType;
                break;
            case Number:
                return numberType;
                break;
            case Object:
                return objectType;
                break;
            case Function:
                return functionType;
                break;
            case null:
                return function() {
                    return true;
                }
                break;
            default:
                return classType(type);
        }
    }
};  