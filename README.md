# Streams

Lightweight and minimalistic solution to reactivity. It is intended to be used together with [ApăJS](https://github.com/alpalma95/apajs), but I'll make it a standalone solution.
This is still in progress, but so far capabilities include:

- Declare reactive objects, either primitives or object references, via a single function `stream()`. If a primitive has been provided, its value can be accessed or set via `myStream.val`. In the case of objects, we can simply access and set the properties as in a plain object (eg: `myStream.count`):

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

- Reacting to changes with `derive(()=>{})`

  ```javascript
  const count = stream(0);

  derive(() => console.log(count.val));
  // Prints 0 when first declared

  count.val = 2;
  // Automatically prints 2

  const user = stream({
    username: "Jon",
    email: "jondoe@testmail.com",
  });

  derive(() => console.log(count.val));
  // Prints 'Jon'
  user.username = "Jane";
  // Automatically prints 'Jane'
  ```

## Upcoming

- [] Computed values
- [] Cleanup unused effects
- [] Tests implementation
- [] Type definitions
