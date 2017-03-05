const Capsule = require('./../capsule');
const Person = require('./test-person');

module.exports = function(options) {
    options = options || {
        strictTypes: true,
        freeze: true
    };

    return new Capsule({
        props: {
            name: String,
            phone: Number,
            emails: Array,
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
            DOB: Date
        }
    }, options);
}