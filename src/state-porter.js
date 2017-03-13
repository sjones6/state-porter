const type = require('./type');
const subscribe = require('./subscribe');
module.exports = function(propertyRules, options) {
    "use strict";

    this.object = {};
    this.propertyRules = propertyRules;
    
    options = options || {};

    let store = {};
    let subscriptions = {};
    let initialValues = {};
    let reservedKeywords = ["subscribe", "unsubscribe"];

    let setProperty = function(propName, typeChecker, value) {
        if (typeChecker(value)) {
            var oldVal = store[propName];
            store[propName] = value;

            // This returns a promise, but don't handle
            // it. The promise is simply so we can return
            // quickly while subscriptions run asynchronously
            subscribe.run(propName, value, oldVal);
            
            return;
        }
        throw new Error(`Trying to set '${propName}' with type ${typeof value}: ${value}`);
    }

    let getProperty = function(propName) {
        return store[propName];
    };

    // Properties
    if (this.propertyRules.props) {
        let props = this.propertyRules.props;
        Object.keys(props).forEach((privateProp) => {
            if (props.hasOwnProperty(privateProp)) {
                let self = this;

                if (reservedKeywords.indexOf(privateProp) !== -1) {
                    throw "'subscribe' is a reserved keyword in Porter";
                }

                let typeDeclaration = props[privateProp];
                if (type.isObject(props[privateProp])) {
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
                });
            }
        });
    }

    // Set the initial values for declared defaults
    Object.keys(initialValues).forEach((initialValueKey) => {
        this.object[initialValueKey] = initialValues[initialValueKey];
    });

    this.object.subscribe = function(propName, callback) {
        if (!this.hasOwnProperty(propName)) {
            throw `${propName} is not available on this Porter.`;
        }
        if (!type.isFunction(callback)) {
            throw "The second parameter passed to `subscribe` must be a callback";
        }
        subscribe.prop(propName, callback);
    };

    this.object.unsubscribe = function(propName) {
        subscribe.removeProp(propName);
    };


    // Computed Properties
    if (this.propertyRules.computed) {
        let computedProps = this.propertyRules.computed;
        Object.keys(computedProps).forEach((computedProp) => {
            if (computedProps.hasOwnProperty(computedProp)) {
                var computed = computedProps[computedProp];

                // Ensure no collisions with existing props
                if (this.object[computedProp]) {
                    throw "Cannot declare computed property with the same key as a generic property";
                }

                let typeChecker = type.getTypeChecker(computed.type);
                Object.defineProperty(this.object, computedProp, {
                    get: function() {
                        return getProperty(computedProp);
                    },
                    set: function(value) {
                        setProperty(computedProp, typeChecker, value);
                    },
                    configurable: true,
                    enumerable: true
                });

                let subscribeToDependency = propName => {
                    subscribe.computed(propName, computedProp, computed.calc, this.object);
                };

                if (computed.deps === "*") {
                    Object.keys(this.propertyRules.props).forEach(propName => {

                        // Don't subscribe to its own property
                        if (propName !== computedProp) {
                            subscribeToDependency(propName)
                        }
                    });
                } else if (type.isArray(computed.deps)) {
                    computed.deps.forEach(subscribeToDependency); 
                } else if (type.isString(computed.deps)) {
                    subscribeToDependency(computed.deps);
                }
            }
        });
    }

    // Freeze the storage object by default,
    // can be override by options.freeze
    if (options.freeze !== false) {
        Object.freeze(this.object);
    }

    return this.object;
};