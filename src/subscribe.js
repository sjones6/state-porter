let subscriptions = {};
let computedSubscriptions = {};

module.exports = {
    run(propName, newVal, oldVal) {
        return new Promise((resolve) => {
            if (subscriptions[propName]) {
                subscriptions[propName](newVal, oldVal);
            }
            if (computedSubscriptions[propName]) {
                computedSubscriptions[propName].forEach(computed => {
                    computed.context[computed.computedPropName] =  computed.calc.call(computed.context);
                });
            }
            resolve();
        });
    },
    prop(propName, callback) {
        subscriptions[propName] = callback;
    },
    removeProp(propName) {
        delete subscriptions[propName];
    },
    computed(propName, computedPropName, calc, context) {
        if (!computedSubscriptions[propName]) {
            computedSubscriptions[propName] = [];
        }
        computedSubscriptions[propName].push({computedPropName, calc, context});
    }
}
