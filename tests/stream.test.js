import { stream, derive } from "../src/stream";
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
    derive(() => c.log(count.val));
    expect(c.logs.length).toEqual(1);
  });

  it("should log twice and printed value should be new one", () => {
    const count = stream(0);
    derive(() => c.log(count.val));
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
    derive(() => c.log(user.username));
    expect(c.logs.length).toEqual(1);
  });

  it("should log twice and printed value should be new one", () => {
    const user = stream({ username: "Jon" });
    derive(() => c.log(user.username));
    user.username = "Jane";
    expect(c.logs.length).toEqual(2);
    expect(c.logs.at(-1)).toEqual("Jane");
  });
});

// when accessing >2 streams in a derive, effect should be trigger when any of the values change
// for instance () => a.val, b.val, c.val is triggered when a, b, or c changes
