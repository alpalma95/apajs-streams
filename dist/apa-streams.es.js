let n = null, s = /* @__PURE__ */ new WeakMap(), g = (e) => {
  n = e, e(), n = null;
}, c = (e, r) => {
  if (n === null)
    return;
  let t = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Set();
  s.has(e) ? (t = s.get(e), p = t.get(r)) : (s.set(e, t), t = s.get(e), t.set(r, p), p = t.get(r)), p.add(n);
}, f = (e, r) => {
  if (!s.get(e))
    return;
  s.get(e).get(r).forEach((l) => l());
}, d = (e) => {
  let r = typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, p]) => [
      t,
      typeof p == "object" ? d(p) : p
    ])
  ) : typeof e == "function" ? { val: e() } : { val: e };
  return new Proxy(r, {
    get(t, p, l) {
      return c(t, p), Reflect.get(t, p, l);
    },
    set(t, p, l, o) {
      return Reflect.set(t, p, l, o), f(t, p), !0;
    }
  });
};
export {
  g as derive,
  d as stream
};
