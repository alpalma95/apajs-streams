import { stream, hook } from "../src/stream";
import { MockConsole } from "./utils";

describe("Primitive-based streams returns correct value", () => {
  const count = stream(1);
  it("sould return initial value", () => {
    expect(count.val).toEqual(1);
  });

  it("should return new value", () => {
    count.val = 2;
    expect(count.val).toEqual(2);
  });
});

describe("Object-based streams should return correct value", () => {
  const user = stream({
    username: "Jon",
    email: "jondoe@testmail.com",
  });
  it("should return initial object", () => {
    expect(user).toEqual({
      username: "Jon",
      email: "jondoe@testmail.com",
    });
  });
  it("should return initial username", () => {
    expect(user.username).toEqual("Jon");
  });
  it("should return new username", () => {
    user.username = "Jane";
    expect(user.username).toEqual("Jane");
  });
});

describe("Primitive-based streams trigger side efects", () => {
  let c = new MockConsole();

  beforeEach(() => {
    c.logs = [];
  });

  it("should log once when value isn't mutated", () => {
    const count = stream(0);
    hook(() => c.log(count.val));
    expect(c.logs.length).toEqual(1);
  });

  it("should log twice and printed value should be new one", () => {
    const count = stream(0);
    hook(() => c.log(count.val));
    count.val = 1;
    expect(c.logs.length).toEqual(2);
    expect(c.logs.at(-1)).toEqual(1);
  });
});

describe("Object-based streams trigger side efects", () => {
  let c = new MockConsole();

  beforeEach(() => {
    c.logs = [];
  });

  it("should log once when value isn't mutated", () => {
    const user = stream({ username: "Jon" });
    hook(() => c.log(user.username));
    expect(c.logs.length).toEqual(1);
  });

  it("should log twice and printed value should be new one", () => {
    const user = stream({ username: "Jon" });
    hook(() => c.log(user.username));
    user.username = "Jane";
    expect(c.logs.length).toEqual(2);
    expect(c.logs.at(-1)).toEqual("Jane");
  });
});

describe("Callback should not be triggered if new value is same as old value", () => {
  let c = new MockConsole();

  beforeEach(() => {
    c.logs = [];
  });

  it("should log once", () => {
    const count = stream(0);
    hook(() => c.log(count.val));
    count.val = 0;
    expect(c.logs.length).toEqual(1);
  });

  it("should log once", () => {
    const user = stream({ username: "jon" });
    hook(() => c.log(user.username));
    user.username = "jon";
    expect(c.logs.length).toEqual(1);
  });
});

describe("Callback should be called whenever any of the dependencies change", () => {
  let c = new MockConsole();

  beforeEach(() => {
    c.logs = [];
  });

  it("should return the sum of initial values", () => {
    const num1 = stream(1);
    const num2 = stream(2);
    expect(num1.val + num2.val).toEqual(3);
  });

  it("should log three times", () => {
    const num1 = stream(1);
    const num2 = stream(2);

    hook(() => {
      c.log(`num1 + num2 = ${num1.val + num2.val}`);
    });
    num1.val = 2;
    num2.val = 3;

    console.log(c.logs);
    expect(c.logs.length).toEqual(3);
  });

  it("should log three times", () => {
    const user = stream({ username: "jane" });
    const user2 = stream({ username: "jon" });

    hook(() =>
      c.log(`Users in database: ${user.username} and ${user2.username}`)
    );
    user.username = "al";
    user2.username = "ro";

    expect(c.logs.length).toEqual(3);
  });
});

describe("Computed values work", () => {
  let c = new MockConsole();

  beforeEach(() => {
    c.logs = [];
  });

  const count = stream(1);
  const double = stream(() => count.val * 2);

  it("should return double of initial value", () => {
    expect(double.val).toEqual(2);
  });

  it("should change when initial value changes", () => {
    count.val = 4;
    expect(double.val).toEqual(8);
  });

  const num1 = stream(2);
  const num2 = stream(1);
  const num1PlusNum2 = stream(() => num1.val + num2.val);

  it("should compute values coming from more than one stream", () => {
    expect(num1PlusNum2.val).toEqual(3);
  });

  it("should update when any of initial values change", () => {
    num1.val++;
    expect(num1PlusNum2.val).toEqual(4);
    num2.val++;
    expect(num1PlusNum2.val).toEqual(5);
  });

  it("should trigger side effects", () => {
    let nonReactive;

    hook(() => (nonReactive = num1PlusNum2.val));
    expect(nonReactive).toEqual(5);
    num1.val++;
    expect(nonReactive).toEqual(6);
    num2.val++;
    expect(nonReactive).toEqual(7);
  });

  let birthYear = 1995;
  let currentYear = stream(2023);

  let user = stream({
    name: "Jon",
    age: () => currentYear.val - birthYear,
  });

  it("should work inside objects", () => {
    expect(user.age.val).toEqual(28);
  });

  it("should be reactive when inside an object", () => {
    currentYear.val++;
    expect(user.age.val).toEqual(29);
  });

  it("should trigger side effects when inside an object", () => {
    hook(() => c.log(user.age.val));
    currentYear.val++;

    expect(c.logs.length).toEqual(2);
  });
});

describe("Effects should be cleared on demand", () => {
  let c = new MockConsole();
  beforeEach(() => {
    c.logs = [];
  });

  it("should clear the effect when a single dependency is registered", () => {
    let count = stream(0);
    let effect = hook(() => c.log(count.val));
    count.val++;
    effect.unhook();
    count.val++;
    expect(c.logs.length).toEqual(2);
    expect(count.val).toEqual(2);
  });

  it("should clear the effects when more than one dependency is used", () => {
    let count = stream(0);
    let count2 = stream(1);
    let effect = hook(() => c.log(count.val + count2.val));
    count.val++;
    count2.val++;
    effect.unhook();
    count.val++;
    count2.val++;
    expect(c.logs.length).toEqual(3);
  });

  it("should clear the effects of computed values", () => {
    let count = stream(0);
    let count2 = stream(1);
    let computed = stream(() => count.val + count2.val);
    let effect = hook(() => c.log(computed.val));
    count.val++;
    count2.val++;
    effect.unhook();
    count.val++;
    count2.val++;
    expect(c.logs.length).toEqual(3);
    expect(computed.val).toEqual(5);
  });
});
