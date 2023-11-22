# Streams

Lightweight and minimalistic solution to reactivity. It was originally intended to be used together with [ApăJS](https://github.com/alpalma95/apajs), but you can always use it as a standalone solution.

## Reactive objects

Reactive objects can be either primitives or object references. Simply, pass the value you want to make reactive to the `stream()` function.
If a primitive has been provided, its value can be accessed or set via `myVar.val`. In the case of objects, we can simply access and set the properties as in a plain object (eg: `myObject.count`):

```javascript
const count = stream(0);
console.log(count.val); // 0
count.val = 2;
console.log(count.val); // 2

const user = stream({
  username: "Jon",
  email: "jondoe@testmail.com",
});

console.log(user.username); // 'Jon'
user.username = "Jane";
console.log(user.username); // 'Jane'
```

## Reacting to changes with `hook()`

The function `hook` accepts a callback that will be executed whenever any of the dependencies change.

Whenever we read the value of a stream inside a hook, the stream(s) whose value we're reading will be automatically registered as a dependency of the given callback.

Unlike signals\*, it's not necessary to provide a way of "peeking" the value of a stream. Effects will only be triggered and registered when passed to a hook.

<sub>\* Signals are a much more complex project and no way we're even comparing Streams to Signals, this is just an illustrative note</sub>

The following is completely safe:

```javascript
let count = stream(0);
console.log(count.val); // This won't register any side effect!
```

Usage examples:

```javascript
const count = stream(0);

hook(() => console.log(count.val));
// Logs 0 when first declared

count.val = 2;
// Automatically logs 2

const user = stream({
  username: "Jon",
  email: "jondoe@testmail.com",
});

hook(() => console.log(user.username));
// Logs 'Jon'
user.username = "Jane";
// Automatically logs 'Jane'
```

## Computed values:

The simplest way to derive a computed value is by passing a callback to the `stream` function. Under the hood, it'll be automatically called into a derive which will set the value any time any of the dependencies change.

> Notice: Computed streams are still regular streams. This means that you can modify their value from outside the dependency callback. While this is **discouraged**, nothing is preventing you from doing so.

```javascript
const num1 = stream(2);
const num2 = stream(1);
const num1PlusNum2 = stream(() => num1.val + num2.val); // 3

hook(() => console.log(num1PlusNum2.val)); // logs 3
num1++; // Automatically logs 4
num2++; // Automatically logs 5
num1PlusNum2.val = 38; // will work but do it at your own risk
num2++; // Logs 6, restoring the original flow
```

While you cannot create "computed objects", you can easily declare computed properties inside object streams by setting the property to be the computed callback:

```javascript
let birthYear = 1995;
let currentYear = stream(2023);

let user = stream({
  name: "Jon",
  age: () => currentYear.val - birthYear, // this would be the same as age: stream(() => currentYear.val - birthYear)
});

hook(() => console.log(user.age.val)); // logs 28
currentYear.val++; // logs 29
birthYear++; // doesn't log anything because it's not a reactive variable
```

## Upcoming

- [ ] Cleanup unused effects
- [ ] Type definitions
