# Capsule

(Name subject to change once I release on NPM)

Better state management for JavaScript objects.

## Installation

This package is not on NPM yet, so you'll need to clone the repo and install it manually.

Once you've cloned the code, install the dependencies:

with NPM: `npm install`

or 

with Yarn: `yarn`;

## Getting Started

Capsule works by leveraging the "privacy" of closures in Javascript functions, and especially constructor functions.

In order for Capsule to provide help with an object's private state, you'll need create a new instance of Capsule inside of your constructor function. Simply never set the Capsule instance on the object constructed and it will not be accessible
outside of that closure.

Effectively, this means that the capsule instance is available only to the object created by the constructor.

```javascript
const Capsule = require('capsule');

// Here's your constructor function
let Person = function(name) {
 
  // Capsule takes two params, and only one is required
  // 1.) RequiredAn object with property declarations
  // 2.) Optional: options to loosen strictness
  store = new Capsule({
    props: {
        
        // Declare your property names here
        // and their types.
        name: String,
        emails: Array,

        // You can use this alternative syntax
        // to declare an initial/default value 
        // along with the type declaration
        location {
            type: Object,
            default: {
                lat: "",
                long: ""
            }
        }
    },

    // Computed properties are not yet supported
    // but are in development
    computed: {
    }
  }, {

    // Whether to enforce strict types
    // during setting. Defaults to true
    strictTypes: true,

    // Whether to freeze after initialization;
    // If frozen, store's properties can be
    // manipulated but no properties added.
    // Defaults to true.
    freeze: true
  });

  store.name = name;
    
  this.greet = function() {
    return `Hi, ${store.name}!`;
  };
  this.addEmail = function(email) {
      store.emails.push(email);
  }
  this.setLocation = function(location) {
      store.location = location;
  }
  this.getLocation = function() {
      return store.location;
  }
    
}

let jane = new Person('jane');
let bob = new Person('bob');

jane.greet() // Hi, jane

bob.addEmail('bob@email.com');
bob.emails // undefined
```

## Yeah, but isn't it slower than plain JavaScript objects?

Yes, of course. Capsule adds some overhead to getting and setting values.

If performance is your only consideration, then don't use Capsule.

However, if you want better state management for your JavaScript objects, then you will have to decide if Capsule's overhead is an acceptable cost. 

If you're already doing a lot of type checking and enforcing setter methods, then Capsule takes a lot of this pain away so that you can focus on creating and not on boilerplate.

I feel that the time spent debugging mis-managed state more than makes up for the performance difference. You can decide if Capsule is right for you.

Here's the stats on my machine:

Raw Object Properties (no accessor methods): ~40k operations/ms
Object with accessor methods: ~20k operations/ms
Capsule: ~12k operations/ms

To profile your machine, install Capsule and run `npm run capsule-profile` (must have Node and npm installed).

## In Development

Subscribe to property updates.

```javascript

capsule.subscribe('propName', (newValue, oldValue) => {
    // update logic
});

```