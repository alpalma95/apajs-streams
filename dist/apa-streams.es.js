let n = null, l = /* @__PURE__ */ new WeakMap(), c = (t) => {
  n = t, t(), n = null;
}, u = (t, p) => {
  if (n === null)
    return;
  let e = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  l.has(t) ? (e = l.get(t), r = e.get(p)) : (l.set(t, e), e = l.get(t), e.set(p, r), r = e.get(p)), r.add(n);
}, d = (t, p) => {
  if (!l.get(t))
    return;
  l.get(t).get(p).forEach((s) => s());
}, M = (t) => {
  let p = {
    object: () => Object.fromEntries(
      Object.entries(t).map(([e, r]) => [
        e,
        typeof r == "object" ? f(r) : r
      ])
    ),
    function: () => {
      let e = f(1);
      return c(() => e.val = t()), e;
    }
  };
  return p[typeof t] ? p[typeof t]() : { val: t };
}, f = (t) => {
  let p = M(t);
  return new Proxy(p, {
    get(e, r, s) {
      return u(e, r), Reflect.get(e, r, s);
    },
    set(e, r, s, o) {
      return e[r] !== s && (Reflect.set(e, r, s, o), d(e, r)), !0;
    }
  });
};
export {
  c as derive,
  f as stream
};
