const assert = require('assert');

const testCapsule = require('./test-capsule');
const Person = require('./test-person');
const Animal = require('./test-animal');

let store = testCapsule({
        strictTypes: false,
        freeze: false
    });

describe('Capsule with loose settings', function() {
    
    describe('#typeChecking', function() {

        it('should accept a non-string', function() {
            store.name = true;
            assert.strictEqual(store.name, true);
        });

        it('should accept a non-number', function() {
            store.phone = true;
            assert.strictEqual(store.phone, true);
        });

        it('should accept a non-array', function() {
            store.emails = true;
            assert.strictEqual(store.emails, true);
        });

        it('should accept a non-object', function() {
            store.location = true;
            assert.strictEqual(store.location, true);
        });

        it('should accept a non-boolean', function() {
            store.hasChildren = 'string';
            assert.strictEqual(store.hasChildren,'string');
        });

        it('should accept a non-function', function() {
            store.isAvailable = 'string';
            assert.strictEqual(store.isAvailable, 'string');
        });

        it('should accept incorrect class', function() {
            let animal  = new Animal('ted', 'bark');
            store.spouse = animal;
            assert.deepStrictEqual(store.spouse, animal);
        });
    });

    describe('#addNewProperties', function() {
        it('should freeze the storage object', function() {
            assert.strictEqual(Object.isFrozen(store), false);
        });

        it('should allow adding new properties', function() {
            store.newProp = true;
            assert.strictEqual(store.newProp, true);
        });
    });

});