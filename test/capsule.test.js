const assert = require('assert');

const CapsuleTester = require('./test-capsule');
const TestPerson = require('./test-person');
const TestAnimal = require('./test-animal');

const testCapsule = new CapsuleTester();


describe('Capsule', function() {
    describe('#getters', function() {
        it('should should return a string', function() {
            assert.equal(testCapsule.sayHi(), 'Spencer says hi!');
        });
    });

    describe('#checkTypes', function() {
        it('should correctly type check for custom class', function() {
            testCapsule.setSpouse(new TestPerson('Jane Doe', 'jane@email.com'));
            assert.equal(testCapsule.getSpouse() instanceof TestPerson, true);
        });

        it('should not throw an error with variable type', function() {
            testCapsule.setEmailToArray();
            testCapsule.setEmailToObject();
            testCapsule.setEmailToString();
            assert.equal(testCapsule.getEmail(), 'testemail@tester.com');
        });
    });

    describe('#throwErrorsOnBrokenTypes', function() {
        let typeErrorCheck = function(err) {
            if ((err instanceof Error) && /Trying to set/.test(err)) {
              return true;
            }
        }
        it('should throw an error', function() {
            assert.throws(
                testCapsule.breakType,
                typeErrorCheck,
                'unexpected error thrown from testCapsule#breakType'
            );
        });

        it('should correctly type check for custom class and throw error', function() {
            let setSpouse = function() {
                testCapsule.setSpouse(new TestAnimal('Pancake', 'meow'));
            }
            assert.throws(
                setSpouse,
                typeErrorCheck,
                'unexpected error thrown from testCapsule#breakType'
            );
        });

        it('should throw an error when setting value to `undefined`', function() {
            let setSpouse = function() {
                testCapsule.setSpouse(undefined);
            }
            assert.throws(
                setSpouse,
                typeErrorCheck,
                'unexpected error thrown from testCapsule#breakType'
            );
        });
    });

    describe('#shouldSetDefaultValues', function() {
        it('should correctly set default values', function() {
            assert.equal(testCapsule.hasChildren(), false);
        });
    });
});