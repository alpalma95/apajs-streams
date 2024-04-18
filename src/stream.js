let active = null;
let targetMap = new WeakMap();

class Dep {
  constructor(cb) {
    this.cb = cb;
    this._set = new Set();
  }
  unhook() {
    this._set.forEach((s) => s.delete(this));
  }
}

/**
 * @param {WeakMap} tm
 * @param {Map} target
 * @param {String} value
 */
const resolveDeps = (tm, target, value) => {
  /** @type {Set<Dep>} */
  let deps;
  tm.has(target) && tm.get(target).has(value)
    ? (deps = tm.get(target).get(value))
    : tm.has(target) && !tm.get(target).has(value)
    ? tm.get(target).set(value, (deps = new Set()))
    : tm.set(target, new Map([[value, (deps = new Set())]]));

  return deps;
};

export let hook = (cb) => {
  active = new Dep(cb);
  active.cb();
  let temp = active;
  active = null;
  return temp;
};
let track = (target, value) => {
  if (active === null) return;
  let deps = resolveDeps(targetMap, target, value);

  active._set.add(deps);
  deps.add(active);
};
let trigger = (target, value) => {
  if (!targetMap.get(target)) return;
  let deps = targetMap.get(target).get(value);
  deps.forEach(({ cb }) => cb());
};

let getInitialValue = (initialVal) => {
  if (
    Array.isArray(initialVal) ||
    (typeof initialVal !== "function" && typeof initialVal !== "object")
  ) {
    return { val: initialVal };
  } else if (typeof initialVal == "function") {
    let temp = stream(1);
    hook(() => (temp.val = initialVal()));
    return temp;
  } else {
    return Object.fromEntries(
      Object.entries(initialVal).map(([k, v]) => [
        k,
        typeof v == "object" || typeof v == "function" ? stream(v) : v,
      ])
    );
  }
};

export let stream = (initialVal) => {
  let base = getInitialValue(initialVal);
  return new Proxy(base, {
    get(target, value, receiver) {
      track(target, value);

      return Reflect.get(target, value, receiver);
    },
    set(target, value, nv, receiver) {
      if (target[value] !== nv) {
        Reflect.set(target, value, nv, receiver);
        trigger(target, value);
      }
      return true;
    },
  });
};
