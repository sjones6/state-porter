console.log('Profiling Porter ...');

const Porter = require('./state-porter.js');

let iterations = 1000000;
let PorterMaker = function() {

    let store = new Porter({
        props: {
            name: String
        }
    });

    this.setName = function(name) {
        store.name = name;
    }
    this.getName = function() {
        return store.name;
    }
}
let testPorter = new PorterMaker();

let startPorter = Date.now();
for (let i = 0; i < iterations; i++)  {
    testPorter.setName('Name');
    let name = testPorter.getName();
}
let endPorter = Date.now();

let plainObject = {
    setName: function(name) {
        this.name = name;
    },
    getName: function(name) {
        return this.name;
    }
};

let startPlainObject = Date.now();
for (let i = 0; i < iterations; i++)  {
    plainObject.name = 'Name';
    let name = plainObject.name;
}
let endPlainObject = Date.now();

let plainObjectGetters = {};
var name;
Object.defineProperty(plainObjectGetters, 'name', {
    get: function() {
        return name;
    },
    set: function(value) {
        name = value;
    },
    configurable: true,
    enumerable: true
});

let startPlainObjectWithGetters = Date.now();
for (let i = 0; i < iterations; i++)  {
    plainObjectGetters.name = 'Name';
    let name = plainObject.name;
}
let endPlainObjectWithGetters = Date.now();


let startPlainObjectWithAccessors = Date.now();
for (let i = 0; i < iterations; i++)  {
    plainObject.setName('Name');
    let name = plainObject.getName();
}
let endPlainObjectWithAccessors = Date.now();


let porterDuration = endPorter - startPorter ;
let plainObjectDuration = endPlainObject - startPlainObject;
let plainObjectGettersDuration = endPlainObjectWithGetters - startPlainObjectWithGetters;
let plainObjectWithAccessorsDuration = endPlainObjectWithAccessors - startPlainObjectWithAccessors;

let portStats = {
    duration: porterDuration + 'ms',
    operationsPerMs: iterations / porterDuration
};
let plainObjectStats = {
    duration: plainObjectDuration + 'ms',
    operationsPerMs: iterations / plainObjectDuration
};
let plainObjectStatsGetters = {
    duration: plainObjectGettersDuration + 'ms',
    operationsPerMs: iterations / plainObjectGettersDuration
};
let plainObjectStatsWithAccessors = {
    duration: plainObjectWithAccessorsDuration + 'ms',
    operationsPerMs: iterations / plainObjectWithAccessorsDuration
};

console.log({plain: plainObjectStats, nativeGetter: plainObjectStatsGetters, accessors: plainObjectStatsWithAccessors, porter: portStats});
