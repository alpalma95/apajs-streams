# Streams

Lightweight and minimalistic solution to reactivity. It was originally intended to be used together with [ApăJS](https://github.com/alpalma95/apajs), but you can always use it as a standalone solution.

## Usage

### Reactive objects

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

### Reacting to changes with `hook()`

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

### Computed values:

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

### Clearing callbacks

Typically, callbacks should be cleared automatically by the garbage collector when the object doesn't exist anymore. However, there are a few situations where you may want to remove the effect from the dependencies manually:

Streams can share state across several files (including components, if you'd like to use it in a frontend application!). If you're creating streams inside the component, these streams should be removed automatically with all their dependencies when the component enters the destroy phase. However, if the stream has been created outside of the component, the callback will remain in the dependencies of the stream even if you have destroyed the component.

Whether it is because of the situation above, or because you simply want to stop a certain callback from happening anymore, know that hooks return the dependency itself. The dependencies (`Dep`s, in the codebase) are simply a class with the callback, a set containing the set(s) where it has been included and an `unhook` method, which will remove the dependency from the set(s). Example usage:

```javascript
const count = stream(0);
const effect = hook(() => console.log(count.val)); // logs 0 as normally
count.val++; // logs 1
effect.unhook();
count.val++; // no more logging!
```

> Notice it'll work exactly the same even if we have more than one dependency in the callback

## Credits

The following projects and talks served as a profound inspiration to get Streams up and running:

- [Vue reactivity](https://github.com/vuejs/core/tree/main/packages/reactivity), whose code I tried to understand but I'm not that smart/patient yet hehe.
- [Marc Backes' talk](https://www.youtube.com/watch?v=zZ99CTme5yM&ab_channel=VueGermany) on Vue Conf 2022, which triggered the spark of my curiosity. It also showed me the "capture active strategy" (I'm sure it does have a name, if anyone can share it'd be much appreciated).
- [VanJS](https://github.com/vanjs-org/van), whose minimalistic design and code-saving strategy inspired several decisions on the Streams syntax (both API and codebase).

## Upcoming

- [ ] Type definitions
