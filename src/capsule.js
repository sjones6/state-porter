const type = require('./type');
module.exports = function(propertyRules, options) {

    this.object = {};
    this.propertyRules = propertyRules;
    this.options = options;

    let store = {};
    setProperty = function(propName, typeChecker, value) {
        if (options.strictTypes) {
            if (!typeChecker(value)) {
                throw new Error(`Trying to set ${propName} type, but was actually ${value}`);
            }
            store[propName] = value;
            return;
        }
        store[propName] = value;
    }

    getProperty = function(propName) {
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

                Object.defineProperty(this.object, privateProp, {
                    get: function() {
                        return getProperty(privateProp);
                    },
                    set: function(value) {
                        let typeChecker = type.getTypeChecker(typeDeclaration);
                        setProperty(privateProp, typeChecker, value);
                    },
                    configurable: true,
                    enumerable: true
                })
            }
        });
    }

    Object.keys(initialValues).forEach((initialValueKey) => {
        this.object[initialValueKey] = initialValues[initialValueKey];
    });

    if (this.options.freeze !== false) {
        Object.freeze(this.object);
    }

    return this.object;
};