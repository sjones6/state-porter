const assert = require('assert');

const testCapsule = require('./test-capsule');
const Person = require('./test-person');
const Animal = require('./test-animal');

let store = testCapsule({
        strictTypes: false,
        freeze: false
    });

describe('Capsule with loose settings', function() {
    describe('settersAndGetters', function() {
        it('should set a string', function() {
            store.name = 'Name'
            assert.strictEqual(store.name, 'Name');
        });

        it('should set a number', function() {
            store.phone = 1234567890;
            assert.strictEqual(store.phone, 1234567890);
        });

        it('should set an array', function() {
            store.emails = ['first', 'second'];
            assert.deepEqual(store.emails, ['first', 'second']);
        });

        it('should set an object', function() {
            let loc = {lat: 12.3456, long: 12.3456};
            store.location = loc;
            assert.deepStrictEqual(store.location, loc);
        });

        it('should set an boolean', function() {
            store.hasChildren = true;
            assert.strictEqual(store.hasChildren, true);
        });

        it('should set an custom class', function() {
            let spouse = new Person('jane', 'jane@email.com');
            store.spouse = spouse;
            assert.deepStrictEqual(store.spouse, spouse);
        });

        it('should allow all types', function() {
            store.favoriteSports = {first: 'Football', second: 'Baseball'};
            store.favoriteSports = 'Table tennis';
            assert.strictEqual(store.favoriteSports, 'Table tennis');
        });
    });

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

        it('should accept incorrect class', function() {
            let animal  = new Animal('ted', 'bark');
            store.spouse = animal;
            assert.deepStrictEqual(store.spouse, animal);
        });
    });

    describe('#setDefaultValues', function() {
        it('should set a boolean default', function() {
            assert.equal(store.isCitizen, true);
        });
    });

    describe('#addNewProperties', function() {
        it('should freeze the storage object', function() {
            assert.strictEqual(Object.isFrozen(store), false);
        });

        it('should disallow adding new properties', function() {
            store.newProp = true;
            assert.strictEqual(store.newProp, true);
        });
    });

});