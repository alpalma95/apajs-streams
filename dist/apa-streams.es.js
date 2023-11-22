let s = null, o = /* @__PURE__ */ new WeakMap();
class u {
  constructor(r) {
    this.cb = r, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((r) => r.delete(this));
  }
}
let f = (e) => {
  s = new u(e), s.cb();
  let r = s;
  return s = null, r;
}, h = (e, r) => {
  if (s === null)
    return;
  let t;
  o.has(e) ? t = o.get(e).get(r) : o.set(e, /* @__PURE__ */ new Map([[r, t = /* @__PURE__ */ new Set()]])), s._set.add(t), t.add(s);
}, d = (e, r) => {
  if (!o.get(e))
    return;
  o.get(e).get(r).forEach(({ cb: n }) => n());
}, b = (e) => {
  let r = {
    object: () => Object.fromEntries(
      Object.entries(e).map(([t, n]) => [
        t,
        typeof n == "object" || typeof n == "function" ? p(n) : n
      ])
    ),
    function: () => {
      let t = p(1);
      return f(() => t.val = e()), t;
    }
  };
  return r[typeof e] ? r[typeof e]() : { val: e };
}, p = (e) => {
  let r = b(e);
  return new Proxy(r, {
    get(t, n, c) {
      return h(t, n), Reflect.get(t, n, c);
    },
    set(t, n, c, l) {
      return t[n] !== c && (Reflect.set(t, n, c, l), d(t, n)), !0;
    }
  });
};
export {
  f as hook,
  p as stream
};
