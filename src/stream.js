let active = null;
let targetMap = new WeakMap();

export let derive = (cb) => {
  active = cb;
  cb();
  active = null;
};
let track = (target, value) => {
  if (active === null) return;

  let depsMapLocal = new Map();
  let depsLocal = new Set();

  if (targetMap.has(target)) {
    // get depsMap from targetMap
    depsMapLocal = targetMap.get(target);
    depsLocal = depsMapLocal.get(value);
  } else {
    // set new entry in targetMap
    targetMap.set(target, depsMapLocal);
    depsMapLocal = targetMap.get(target);
    depsMapLocal.set(value, depsLocal);
    depsLocal = depsMapLocal.get(value);
  }
  // get deps from depsMap

  // add effect to deps <- depsMap <- targetMap
  depsLocal.add(active);
};
let trigger = (target, value) => {
  if (!targetMap.get(target)) return;
  let depsMap = targetMap.get(target);
  let deps = depsMap.get(value);
  deps.forEach((cb) => cb());
};

export let stream = (initialVal) => {
  let base =
    typeof initialVal === "object"
      ? Object.fromEntries(
          Object.entries(initialVal).map(([k, v]) => [
            k,
            typeof v == "object" ? stream(v) : v,
          ])
        )
      : typeof initialVal === "function"
      ? { val: initialVal() }
      : { val: initialVal };
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
