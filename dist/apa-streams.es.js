let o = null, f = /* @__PURE__ */ new WeakMap(), M = (e) => {
  o = e, e(), o = null;
}, l = (e, r) => {
  if (o === null)
    return;
  let t = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Set();
  f.has(e) ? (t = f.get(e), p = t.get(r)) : (f.set(e, t), t = f.get(e), t.set(r, p), p = t.get(r)), p.add(o);
}, n = (e, r) => {
  if (!f.get(e))
    return;
  f.get(e).get(r).forEach((s) => s());
}, d = (e) => {
  let r = typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, p]) => [
      t,
      typeof p == "object" ? d(p) : p
    ])
  ) : typeof e == "function" ? { val: e() } : { val: e };
  return new Proxy(r, {
    get(t, p, s) {
      return l(t, p), Reflect.get(t, p, s);
    },
    set(t, p, s, c) {
      return t[p] !== s && (Reflect.set(t, p, s, c), n(t, p)), !0;
    }
  });
};
export {
  M as derive,
  d as stream
};
