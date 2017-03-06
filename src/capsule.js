const type = require('./type');
module.exports = function(propertyRules, options) {
    "use strict";

    this.object = {};
    this.propertyRules = propertyRules;
    
    options = options || {};

    let store = {};
    let subscriptions = {};
    let initialValues = {};
    let reservedKeywords = ["subscribe", "unsubscribe"];

    // Type checking
    let isObject = type.getTypeChecker(Object);
    let isFunction = type.getTypeChecker(Function);

    let setProperty = function(propName, typeChecker, value) {
        if (typeChecker(value)) {
            if (subscriptions[propName]) {
                subscriptions[propName](value, store[propName]);
            }
            store[propName] = value;
            return;
        }
        throw new Error(`Trying to set ${propName} with type ${typeof value}: ${value}`);
    }

    let getProperty = function(propName) {
        return store[propName];
    };

    if (this.propertyRules.props) {
        let props = this.propertyRules.props;
        Object.keys(props).forEach((privateProp) => {
            if (props.hasOwnProperty(privateProp)) {
                let self = this;

                if (reservedKeywords.indexOf(privateProp) !== -1) {
                    throw "'subscribe' is a reserved keyword in Capsule";
                }

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

    this.object.subscribe = function(propName, callback) {
        if (!this.hasOwnProperty(propName)) {
            throw `${propName} is not available on this Capsule.`;
        }
        if (!isFunction(callback)) {
            throw "The second parameter passed to `subscribe` must be a callback";
        }
        subscriptions[propName] = callback;
    };

    this.object.unsubscribe = function(propName) {
        delete subscriptions[propName];
    };

    // Freeze the storage object by default,
    // can be override by options.freeze
    if (options.freeze !== false) {
        Object.freeze(this.object);
    }

    return this.object;
};