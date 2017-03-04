const Capsule = require('./../capsule');
const Person = require('./test-person');


module.exports = function() {
    "use strict";
    let store = new Capsule({
        props: {
            name: String,
            phone: Number,
            email: null,
            spouse: Person,
            hasChildren: {
                type: Boolean,
                default: false
            }
        }
    }, {
        strictTypes: true,
        freeze: true
    });

    this.setName = function(name) {
        store.name = name;
    }

    this.getName = function() {
        return store.name;
    }

    this.sayHi = function() {
        store.name = "Spencer";
        return store.name + " says hi!";
    }

    this.breakType = function() {
        store.phone = "Spencer's phone is";
    }

    this.setEmailToString = function() {
        store.email = "testemail@tester.com";
    }

    this.setEmailToObject = function() {
        store.email = {
            personal: "testemail@tester.com",
            work: "testemail2@tester.com"
        };
    }

    this.setEmailToArray = function() {
        store.email = ["testemail@tester.com", "testemail2@tester.com"];
    }

    this.getEmail = function() {
        return store.email;
    }

    this.setSpouse = function(spouse) {
        store.spouse = spouse;
    }

    this.getSpouse = function() {
        return store.spouse;
    }

    this.hasChildren = function() {
        return store.hasChildren;
    }

}