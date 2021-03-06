const Porter = require('./../state-porter');
const Person = require('./test-person');

module.exports = function(options) {
    options = options || {
        strictTypes: true,
        freeze: true
    };

    return new Porter({
        props: {
            name: {
                type: String,
                default: ''
            },
            phone: Number,
            emails: {
                type: Array,
                default: []
            },
            location: Object,
            hasChildren: {
                type: Boolean,
                default: false
            },
            isCitizen: {
                type: Boolean,
                default: true
            },
            favoriteSports: {
                type: null,
                default: ['Badminton', 'Tennis']
            },
            spouse: Person,
            isAvailable: Function,
            DOB: Date,
            age: Number
        },
        computed: {
            nameEmail: {
                type: String,
                deps: ['name'],
                calc: function() {
                    return `Name: ${this.name};`;
                }
            },
            nameEmailAge: {
                type: String,
                deps: ['nameEmail', 'age'],
                calc: function() {
                    return `${this.nameEmail} Age: ${this.age}`;
                }
            },
            lastUpdated: {
                type: Date,
                deps: "*",
                calc: function() {
                    return new Date();
                }
            }
        }
    }, options);
}