const assert = require('assert');

const testPorter = require('./test-porter');
const Person = require('./test-person');
const Animal = require('./test-animal');

let store = testPorter();

describe('Porter in Non Strict Mode', function() {

    describe('#addNewProperties', function() {
        it('should freeze the storage object', function() {
            assert.strictEqual(Object.isFrozen(store), true);
        });

        it('should disallow adding new properties', function() {
            store.newProp = true;
            assert.strictEqual(typeof store.newProp, 'undefined');
        });
    });

});