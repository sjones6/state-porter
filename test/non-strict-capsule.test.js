const assert = require('assert');

const testCapsule = require('./test-capsule');
const Person = require('./test-person');
const Animal = require('./test-animal');

let store = testCapsule();

describe('Capsule in Non Strict Mode', function() {
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

        let typeErrorCheck = function(err) {
            if ((err instanceof Error) && /Trying to set/.test(err)) {
              return true;
            }
        }

        it('should reject a non-string', function() {
            assert.throws(
                () => {
                    store.name = true;
                },
                typeErrorCheck);
        });

        it('should reject a non-number', function() {
            assert.throws(
                () => {
                    store.phone = true;
                },
                typeErrorCheck);
        });

        it('should reject a non-array', function() {
            assert.throws(
                () => {
                    store.emails = true;
                },
                typeErrorCheck);
        });

        it('should reject a non-object', function() {
            assert.throws(
                () => {
                    store.location = true;
                },
                typeErrorCheck);
        });

        it('should reject a non-boolean', function() {
            assert.throws(
                () => {
                    store.hasChildren = 'string';
                },
                typeErrorCheck);
        });

        it('should reject incorrect class', function() {
            assert.throws(
                () => {
                    store.spouse = new Animal('ted', 'bark');
                },
                typeErrorCheck);
        });
    });

    describe('#setDefaultValues', function() {
        it('should set a boolean default', function() {
            assert.equal(store.isCitizen, true);
        });
    });

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