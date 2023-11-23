let n = null, o = /* @__PURE__ */ new WeakMap();
class u {
  constructor(t) {
    this.cb = t, this._set = /* @__PURE__ */ new Set();
  }
  unhook() {
    this._set.forEach((t) => t.delete(this));
  }
}
let l = (e) => {
  n = new u(e), n.cb();
  let t = n;
  return n = null, t;
}, h = (e, t) => {
  if (n === null)
    return;
  let r;
  o.has(e) ? r = o.get(e).get(t) : o.set(e, /* @__PURE__ */ new Map([[t, r = /* @__PURE__ */ new Set()]])), n._set.add(r), r.add(n);
}, d = (e, t) => {
  if (!o.get(e))
    return;
  o.get(e).get(t).forEach(({ cb: s }) => s());
}, y = (e) => {
  if (Array.isArray(e) || typeof e != "function" && typeof e != "object")
    return { val: e };
  if (typeof e == "function") {
    let t = f(1);
    return l(() => t.val = e()), t;
  } else
    return Object.fromEntries(
      Object.entries(e).map(([t, r]) => [
        t,
        typeof r == "object" || typeof r == "function" ? f(r) : r
      ])
    );
}, f = (e) => {
  let t = y(e);
  return new Proxy(t, {
    get(r, s, c) {
      return h(r, s), Reflect.get(r, s, c);
    },
    set(r, s, c, p) {
      return r[s] !== c && (Reflect.set(r, s, c, p), d(r, s)), !0;
    }
  });
};
export {
  l as hook,
  f as stream
};
