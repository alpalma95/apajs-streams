let active = null;
let targetMap = new WeakMap();

export let hook = (cb) => {
  active = cb;
  cb();
  active = null;
};
let track = (target, value) => {
  if (active === null) return;
  let deps;

  targetMap.has(target)
    ? (deps = targetMap.get(target).get(value))
    : targetMap.set(target, new Map([[value, (deps = new Set())]]));

  deps.add(active);
};
let trigger = (target, value) => {
  if (!targetMap.get(target)) return;
  let deps = targetMap.get(target).get(value);
  deps.forEach((cb) => cb());
};

let getInitialValue = (initialVal) => {
  let returnMap = {
    object: () => {
      return Object.fromEntries(
        Object.entries(initialVal).map(([k, v]) => [
          k,
          typeof v == "object" || typeof v == "function" ? stream(v) : v,
        ])
      );
    },
    function: () => {
      let temp = stream(1);
      hook(() => (temp.val = initialVal()));
      return temp;
    },
  };
  return returnMap[typeof initialVal]
    ? returnMap[typeof initialVal]()
    : { val: initialVal };
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
