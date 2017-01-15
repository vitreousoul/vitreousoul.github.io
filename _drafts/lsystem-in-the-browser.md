---
title: L-System in the Browser
layout: base
categories: l-system
---

# {{page.title}}

The goal of this post is to implement a simple [L-System](https://en.wikipedia.org/wiki/L-system) (Lindenmayer system) and draw the results using Javascript and HTML5 canvas.

We will need an alphabet of valid characters, an initial state, and production rules for how to generate successive states.

For example:

- Alphabet: a, b
- Initial state: 'a'
- Production Rules:
  - a: 'aab'
  - b: 'bba'

In order to get the next state in a system, each character in the current state is replaced with the string corresponding to the character's production rule. Given the rules defined in the previous example, every 'a' is replaced with 'aab' and every 'b' is replaced with 'bba'. Starting with an initial state of 'a' the next few iterations would be:

- 'a'
- 'aab'
- 'aabaabbba'

Production rules will reside in an object, and the state will be represented as a string. For now, the alphabet will be implied via the rules object.

```javascript
var rules = {
  a: 'aab',
  b: 'bba'
}

var initialState = 'a';
```

A new state can be determined by looping through each character in the current state, and appending the result of that character's rule to an empty string.

```javascript
function getNewState (state, rules) {
  var newState = '';

  for (var charIndex = 0; charIndex < state.length; charIndex++) {
    var character = state[charIndex];

    if (rules[character]) {
      newState += rules[character];
    }
  }

  return newState;
}
```

We _could_ determine the nth state of a system by calling `getNewState` many times inside a loop:

```javascript
var initialState = 'a';
var numberOfIterations = 3;

for (var stateIndex = 0; stateIndex < numberOfIterations; stateIndex++) {
  state = getNewState(state, rules);
}
```

Alternatively, `getNewState` can be recursively called to determine the nth state of a system.

```javascript
function getNewState (state, rules, iterationCount) {
  iterationCount = iterationCount || 1;
  var newState = '';

  for (var charIndex = 0; charIndex < state.length; charIndex++) {
    var character = state[charIndex];

    if (rules[character]) {
      newState += rules[character];
    }
  }

  if (iterationCount > 1) {
    newState = getNewState(newState, rules, --iterationCount);
  }

  return newState;
}
```

For the sake of brevity, we can create a function that loops through each character in a state string and apply the passed function.

```javascript
function forEachChar (state, func) {
  for (var charIndex = 0; charIndex < state.length; charIndex++) {
    var character = state[charIndex];

    if (rules[character]) {
      func(character);
    }
  }
}
```

The length of a state can easily become so large that it slows down the browser, or even crashes it. We can avoid this by ending the recursion if the string gets too long.

```javascript
var STATE_LENGTH_BREAK = 10000;

function getNewState (state, rules, iterationCount) {
  iterationCount = iterationCount || 1;
  var newState = '';

  forEachChar(state, function (character) {
    if (rules[character]) {
      newState += rules[character].nextState;
    }
  });

  if (newState.length < STATE_LENGTH_BREAK && iterationCount > 1) {
    newState = getNewState(newState, rules, --iterationCount);
  }

  return newState;
}
```

simple way to apply rules. how does this work????

```javascript
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var lineLength = 20;

function drawLines (state) {
  // init
  context.beginPath();
  context.translate(canvas.width / 2, canvas.height / 2);
  context.moveTo(0, 0);

  // apply rule
  context.rotate(-Math.PI / 4);
  context.lineTo(lineLength, 0);
  context.translate(lineLength, 0);

  // apply rule
  context.rotate(Math.PI / 4);
  context.lineTo(lineLength, 0);
  context.translate(lineLength, 0);

  // end
  context.stroke();
}
```

let's move the drawing rules into the rules object.

```javascript
var rules = {
  a: {
    nextState: 'aab',
    rule: function (context) {
      context.rotate(-Math.PI / 4);
      context.lineTo(lineLength, 0);
      context.translate(lineLength, 0);
    }
  },
  b: {
    nextState: 'bba',
    rule: function (context) {
      context.rotate(Math.PI / 4);
      context.lineTo(lineLength, 0);
      context.translate(lineLength, 0);
    }
  }
};
```

```javascript
function drawLines (state) {
  // init
  context.beginPath();
  context.translate(canvas.width / 2, canvas.height / 2);
  context.moveTo(0, 0);

  // apply rules
  forEachChar(state, function (character) {
    if (rules[character]) {
      rules[character].rule(context);
    }
  });

  // end
  context.stroke();
}
```

implement context save and restore

```javascript
var initialState = 'a';
var lineLengths = [30];
var lineGrowth = 0.6;
var STATE_LENGTH_BREAK = 10000;

var rules = {
  a: {
    nextState: 'a[a][b]',
    rule: function (context) {
      context.rotate(-Math.PI / 4);
      context.lineTo(lineLengths[lineLengths.length - 1], 0);
      context.translate(lineLengths[lineLengths.length - 1], 0);
    }
  },
  b: {
    nextState: 'b[b][a]',
    rule: function (context) {
      context.rotate(Math.PI / 4);
      context.lineTo(lineLengths[lineLengths.length - 1], 0);
      context.translate(lineLengths[lineLengths.length - 1], 0);
    }
  },
  '[': {
    nextState: '[',
    rule: function (context) {
      context.save();
      lineLengths.push(lineLengths[lineLengths.length - 1] * lineGrowth);
    }
  },
  ']': {
    nextState: ']',
    rule: function (context) {
      context.restore();
      context.moveTo(0, 0);
      lineLengths.pop();
    }
  }
};

var state = getNewState(initialState, rules, 4);

drawLines(state);
```
