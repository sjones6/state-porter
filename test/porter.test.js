
// Importantly, all of these tests are
// run in strict mode. This affects mainly
// what happens when attempting to 
// add properties to the frozen object.
"use strict";

const assert = require('assert');

const testPorter = require('./test-porter');
const Person = require('./test-person');
const Animal = require('./test-animal');

let store = testPorter();

describe('Porter', function() {

    afterEach(function() {
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

    describe('#subscribe', function() {
        it('should call the callback when properties are updated', function() {
            let updateEmail = ['personal@email.com', 'work@email.com'];
            let oldEmail = store.emails;
            store.subscribe('emails', function(newVal, oldVal) {
                assert.deepStrictEqual(newVal, updateEmail);
                assert.deepStrictEqual(oldEmail, oldVal);
            });
            store.emails = updateEmail;
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

    describe('#computedProps', function() {

        it('should calculate a computed property', function() {
            let name = 'Jane';
            let email = 'personal@email.com';
            store.name = name;
            store.emails = [email];
            setTimeout(function() {
                assert.strictEqual(`Name: ${name}; Email: ${email}`, store.nameEmail);
            }, 10);
        });

        it('should calculate a computed property that depends on another computed property', function() {
            let name = 'Jane';
            let email = 'personal@email.com';
            let age = 35;
            store.name = name;
            store.emails = [email];
            store.age = age;
            setTimeout(function() {
                assert.strictEqual(`Name: ${name}; Email: ${email}; Age: ${age}`, store.nameEmailAge);
            }, 10);
        });

        it('should subscribe to a computed property', function() {
            let name = 'Jane';
            let email = 'personal@email.com';
            store.name = name;
            store.emails = [email];

            store.subscribe('nameEmail', (newVal, oldVal) => {
                assert.strictEqual(`Name: ${name}; Email: ${email}`, newVal);
            });
        });
    });

});