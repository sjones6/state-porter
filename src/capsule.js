const type = require('./type');
module.exports = function(propertyRules, options) {
    "use strict";

    this.object = {};
    this.propertyRules = propertyRules;
    options = options || {};

    let store = {};
    let setProperty = function(propName, typeChecker, value) {
        if (typeChecker === true || typeChecker(value)) {
            store[propName] = value;
            return;
        }
        throw new Error(`Trying to set ${propName} with incorrect type: ${value}`);
    }

    let getProperty = function(propName) {
        return store[propName];
    };

    let isObject = type.getTypeChecker(Object);
    let initialValues = {};

    if (this.propertyRules.props) {
        let props = this.propertyRules.props;
        Object.keys(props).forEach((privateProp) => {
            if (props.hasOwnProperty(privateProp)) {
                let self = this;

                let typeDeclaration = props[privateProp];
                if (isObject(props[privateProp])) {
                    typeDeclaration = props[privateProp].type;
                    initialValues[privateProp] = props[privateProp].default;
                }

                // If the options have turned of strictTypes,
                // we'll force the type internally to null.
                // Which effectively disables type checking.
                typeDeclaration = (!options.strictTypes) ? null : typeDeclaration;
                let typeChecker = type.getTypeChecker(typeDeclaration);

                Object.defineProperty(this.object, privateProp, {
                    get: function() {
                        return getProperty(privateProp);
                    },
                    set: function(value) {
                        setProperty(privateProp, typeChecker, value);
                    },
                    configurable: true,
                    enumerable: true
                })
            }
        });
    }

    // Set the initial values for declared defaults
    Object.keys(initialValues).forEach((initialValueKey) => {
        this.object[initialValueKey] = initialValues[initialValueKey];
    });

    // Freeze the storage object by default,
    // can be override by options.freeze
    if (options.freeze !== false) {
        Object.freeze(this.object);
    }

    return this.object;
};