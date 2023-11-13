export class MockConsole {
  constructor() {
    this.logs = [];
    this.log.apply(this);
  }

  log(val) {
    const stringified =
      typeof val !== "string" && typeof val !== "number"
        ? JSON.stringify(val)
        : val;
    this.logs.push(stringified);
  }
}
