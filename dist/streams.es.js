let n = null, c = /* @__PURE__ */ new WeakMap();
class u {
  constructor(t) {
    this.cb = t, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((t) => t.delete(this));
  }
}
const h = (e, t, s) => {
  let r;
  return e.has(t) && e.get(t).has(s) ? r = e.get(t).get(s) : e.has(t) && !e.get(t).has(s) ? e.get(t).set(s, r = /* @__PURE__ */ new Set()) : e.set(t, /* @__PURE__ */ new Map([[s, r = /* @__PURE__ */ new Set()]])), r;
};
let l = (e) => {
  n = new u(e), n.cb();
  let t = n;
  return n = null, t;
}, d = (e, t) => {
  if (n === null)
    return;
  let s = h(c, e, t);
  n._set.add(s), s.add(n);
}, y = (e, t) => {
  if (!c.get(e))
    return;
  c.get(e).get(t).forEach(({ cb: r }) => r());
}, b = (e) => {
  if (Array.isArray(e) || typeof e != "function" && typeof e != "object")
    return { val: e };
  if (typeof e == "function") {
    let t = f(1);
    return l(() => t.val = e()), t;
  } else
    return Object.fromEntries(
      Object.entries(e).map(([t, s]) => [
        t,
        typeof s == "object" || typeof s == "function" ? f(s) : s
      ])
    );
}, f = (e) => {
  let t = b(e);
  return new Proxy(t, {
    get(s, r, o) {
      return d(s, r), Reflect.get(s, r, o);
    },
    set(s, r, o, p) {
      return s[r] !== o && (Reflect.set(s, r, o, p), y(s, r)), !0;
    }
  });
};
export {
  l as hook,
  f as stream
};
