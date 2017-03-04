console.log('Profiling Capsule ...');

const TestCapsule = require('./test/test-capsule');

let iterations = 1000000;
let testCapsule = new TestCapsule();

let startCapsule = Date.now();
for (let i = 0; i < iterations; i++)  {
    testCapsule.setName('Name');
    let name = testCapsule.getName();
}
let endCapsule = Date.now();

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



let startPlainObjectWithAccessors = Date.now();
for (let i = 0; i < iterations; i++)  {
    plainObject.setName('Name');
    let name = plainObject.getName();
}
let endPlainObjectWithAccessors = Date.now();


let capsuleDuration = endCapsule - startCapsule ;
let plainObjectDuration = endPlainObject - startPlainObject;
let plainObjectWithAccessorsDuration = endPlainObjectWithAccessors - startPlainObjectWithAccessors;

let capsuleStats = {
    duration: capsuleDuration + 'ms',
    operationsPerMs: iterations / capsuleDuration
}
let plainObjectStats = {
    duration: plainObjectDuration + 'ms',
    operationsPerMs: iterations / plainObjectDuration
}
let plainObjectStatsWithAccessors = {
    duration: plainObjectWithAccessorsDuration + 'ms',
    operationsPerMs: iterations / plainObjectWithAccessorsDuration
}

console.log({plain: plainObjectStats, accessors: plainObjectStatsWithAccessors, capsule: capsuleStats});
