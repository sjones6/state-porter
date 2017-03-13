# Porter

Better state management for JavaScript objects.

## Installation

`npm install state-porter` or `yarn add state-porter`.

Require Porter into your project:
```javascript
const Porter = require('state-porter');
```

There are no explicit dependencies, except development dependencies for testing. If you want to contribute, install the development dependencies.

## Getting Started

Porter works best within the "privacy" of closures in Javascript functions, and especially constructor functions.

In order for Porter to provide help with an object's private state, you'll need create a new instance of Porter inside of your constructor function. Simply never set the Porter instance on the object constructed and it will not be accessible
outside of that closure. See more about this pattern [here](http://blog.spenceralanjones.com/using-closures-to-create-quasi-encapsulation-in-javascript/).

Effectively, this means that the Porter instance is available only to the object created by the constructor.

```javascript
const Porter = require('Porter');
let Person = function(name) {
  let porter = new Porter({
    props: {
        // Short syntax
        name: String,

        // Long syntax
        location: {
            type: Object,
            default: {
                lat: "",
                long: ""
            }
        },
  }, {
    freeze: true, // default
    strictTypes: true // default
  });

  porter.name = name;
  this.getName = function() {
    return porter.name;
  };
  this.setLocation = function(location) {
      porter.location = location;
  }
  this.getLocation = function() {
      return porter.location;
  }
    
}

let jane = new Person('jane');
let bob = new Person('bob');

jane.getName(); // jane

bob.setLocation({lat: 12.345, long: -12.3459}); // success

jane.setLocation('nowhere'); // throws type error since location expects an object not string
```

## Supported Types

1. String
2. Number
3. Boolean
4. Object
5. Function
6. Classes (including internal and user defined classes)
7. No type checking

These can be declared in the following manner:

```javascript
let porter = new Porter({
  props: {
    string: String,
    number: Number,
    boolean: Boolean,
    object: Object,
    function: Function,
    internalClass: Date,
    customClass: MyCustomClass,
    anyType: null
  }
});
```

## Options

```javascript
let porter = new Porter({
  props: {
    name: String,
    age: Number
  }
}, {
  // default settings:
  freeze: true,
  strictTypes: true
});
```

There are two ways to bypass type checking of properties:

* Disable type checking for a single property by passing a `null` type for in the property declaration
* Disable all type checking by passing `{strictTypes: false}` in the options

By default, the Porter instance is frozen so that no properties can be added after initialization. This behavior can be disabled by passing `{freeze: false}` in the options.

## Computed Properties

Computed properties are recalculated every time one of their dependent properties changes.

```javascript
let porter = new Porter({
  props: {
    name: {
      type: String,
      default: ""
    }
  },
  computed: {
    greeting: {
      type: String,
      deps: ['name'],
      calc: function() {
        return `Hi, ${this.name}!`;
      }
    }
  }
});

porter.name = 'Bob';
console.log(porter.greeting); // Hi, Bob!

porter.name = 'Jane';
console.log(porter.greeting); // Hi, Jane!
```

It is best to declare dependent properties with default values, otherwise the property may be undefined if not set. This may change so that properties are initialized with default values in all cases.

The method is bound to the Porter object, so it can access properties easily with `this.propName`.

Computed properties can depend on other computed properties as long as it does not create a circular dependency which will produce an infinite loop of callbacks.

## Subscribing to Updates

Subscribe to property changes:

```javascript
porter.subscribe('propName', (newValue, oldValue) => {
    // handle update
});

// Removes subscription
porter.unsubscribe('propName'); 
```

Example:
```javascript
let porter = new Porter({
  props: {
    name: {
      type: String,
      default: ''
    }
  }
});

porter.subscribe('name', (newName, oldName) => {
    // update logic
});

porter.name = 'New name'; // fires subscribe handler
```

Only one subscribe handler is supported for each property. Adding a new subscribe handler will replace the previous one.

## Full API


#### Initialization:
```javascript
let porter = new Porter({
    props: {

      // Short property declaration
      userId: Number,
      name: String,

      // Long declaration
      activeUser: {
        type: Boolean,
        default: true
      }
    }, 
    computed: {
      greeting: {
        type: String,
        deps: 'name', // single property
        calc: function() {
          return `Hi ${this.name}`;
        }
      },
      userName: {
        type: String,
        deps: ['name', 'userId'], // multiple properties
        calc: function() {
          return `${this.name}_${this.userId`;
        }
      },
      lastUpdated: {
        type: Date,
        deps: "*", // all non-computed properties
        calc: function() {
          return new Date();
        }
      }
    }
  }, {
    freeze: true,
    strictTypes: true
});  
```
#### `porter.subscribe('propName', (newVal, oldVal) => { });`: Subscribe to property updates

#### `porter.unsubscribe('propName';`: Remove property subscription


## Yeah, but isn't it slower than plain JavaScript objects?

Yes, of course. Porter adds some overhead to getting and setting properties, but the payoff is better state-management.

You will have to decide if Porter's overhead is an acceptable cost. In some applications, especially applications where state-management is not that complicated, Porter may not be necessary. However, in complex applications, it becomes increasingly critical to manage state in ways that are easy to reason about.

If you're already doing a lot of type checking and enforcing setter methods in your objects, then Porter takes a lot of this pain away so that you can focus on creating and not on boilerplate.

You can decide if Porter is right for your application.

However, if you want some raw numbers about how Porter performs:

##### Raw Object Properties (no accessor methods): ~40-42k operations/ms

##### Object with accessor methods: ~21-22k operations/ms

##### Porter: ~18-19k operations/ms

To profile your machine, install Porter and run `npm run porter-profile` (must have Node and npm installed).

## Running Tests

Install the development dependencies before running tests. Tests are powered by Mocha.

`npm run test`



