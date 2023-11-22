let l = null, s = /* @__PURE__ */ new WeakMap(), c = (t) => {
  l = t, t(), l = null;
}, u = (t, p) => {
  if (l === null)
    return;
  let e = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  s.has(t) ? (e = s.get(t), r = e.get(p)) : (s.set(t, e), e = s.get(t), e.set(p, r), r = e.get(p)), r.add(l);
}, d = (t, p) => {
  if (!s.get(t))
    return;
  s.get(t).get(p).forEach((n) => n());
}, M = (t) => {
  let p = {
    object: () => Object.fromEntries(
      Object.entries(t).map(([e, r]) => [
        e,
        typeof r == "object" || typeof r == "function" ? o(r) : r
      ])
    ),
    function: () => {
      let e = o(1);
      return c(() => e.val = t()), e;
    }
  };
  return p[typeof t] ? p[typeof t]() : { val: t };
}, o = (t) => {
  let p = M(t);
  return new Proxy(p, {
    get(e, r, n) {
      return u(e, r), Reflect.get(e, r, n);
    },
    set(e, r, n, f) {
      return e[r] !== n && (Reflect.set(e, r, n, f), d(e, r)), !0;
    }
  });
};
export {
  c as hook,
  o as stream
};
