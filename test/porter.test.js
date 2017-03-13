
// Importantly, all of these tests are
// run in strict mode. This affects mainly
// what happens when attempting to 
// add properties to the frozen object.
"use strict";

const assert = require('assert');

const testPorter = require('./test-porter');
const Person = require('./test-person');
const Animal = require('./test-animal');

describe('Porter', function() {

    let store;
    beforeEach(function() {
        store = testPorter();
    });

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

        it('should set a custom class', function() {
            let spouse = new Person('jane', 'jane@email.com');
            store.spouse = spouse;
            assert.deepStrictEqual(store.spouse, spouse);
        });

        it('should set an internal class', function() {
            let DOB = new Date();
            store.DOB = DOB;
            assert.deepStrictEqual(store.DOB, DOB);
        });

        it('should set an function', function() {
            store.isAvailable = function(available) {
                return !available;
            };
            let available = store.isAvailable(true);
            assert.strictEqual(available, false);
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

        it('should reject a non-function', function() {
            assert.throws(
                () => {
                    store.isAvailable = 'string';
                },
                typeErrorCheck);
        });

        it('should reject incorrect class for internal type', function() {
            assert.throws(
                () => {
                    store.DOB = new RegExp('abc');
                },
                typeErrorCheck);
        });

        it('should reject incorrect class for custom type', function() {
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

        it('should disallow adding new properties with an error', function() {
            assert.throws(
                () => {
                    store.newProp = true;
                },
                Error);
        });
    });


    describe('#computedProps', function() {

        it('should calculate a computed property', function() {
            let name = 'Jane';
            store.name = name;
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(store.nameEmail);
                }, 5);
            }).then((nameEmail) => {
                assert.strictEqual(`Name: ${name};`, nameEmail);
            });
        });

        it('should calculate a computed property that depends on another computed property', function() {
            let name = 'Jane';
            let email = 'personal@email.com';
            let age = 35;
            store.name = name;
            store.emails = [email];
            store.age = age;
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(store.nameEmailAge);
                }, 10);
            })
            .then((nameEmailAge) => {
                assert.strictEqual(`Name: ${name}; Age: ${age}`, nameEmailAge);
            });
        });
    });

    describe('#subscribe', function() {
        it('should call the callback when properties are updated', function() {
            store.emails = [];
            let updateEmail = ['personal@email.com', 'work@email.com'];
            return new Promise((resolve) => {
                    store.subscribe('emails', function(newVal, oldVal) {
                        resolve({newVal, oldVal});
                    });
                    store.emails = updateEmail;
            }).then((vals) => {
                assert.deepStrictEqual(vals.newVal, updateEmail);
                assert.deepStrictEqual(vals.oldVal, []);
            });
        });

        it('subscribe should not overwrite computed props subscribe', function() {
            return new Promise((resolve) => {
                store.name = 'Jane';
                let lastUpdated;
                setTimeout(() => {
                    lastUpdated = store.lastUpdated;

                    // Attempt to overwrite subscription
                    store.subscribe('emails', (newVal, oldVal) => {});
                    store.emails = ['personal@email.com', 'work@email.com'];

                }, 1);
                setTimeout(() => {
                    assert.notStrictEqual(store.lastUpdated.getTime(), lastUpdated.getTime());
                    resolve();
                }, 3);
            });

        });
    });

    describe('#unsubscribe', function() {
        it('should remove subscription', function() {
            let wasCallbackCalled = false;
            store.subscribe('emails', function(newVal, oldVal) {
                wasCallbackCalled = true;
            });
            store.unsubscribe('emails');
            store.emails = ['personal@email.com', 'work@email.com'];

            assert.strictEqual(wasCallbackCalled, false);
        });
    });

});