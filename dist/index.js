'use strict'
var P = (r, t) => () => (t || r((t = { exports: {} }).exports, t), t.exports)
var x = P((j) => {
  'use strict'
  Object.defineProperty(j, '__esModule', { value: !0 }),
    (function (r, t) {
      for (var e in t) Object.defineProperty(r, e, { enumerable: !0, get: t[e] })
    })(j, {
      createActions: function () {
        return F
      },
      createDataFieldsReactions: function () {
        return I
      },
    })
  var l = require('mobx-miniprogram')
  function S(r, t) {
    ;(t == null || t > r.length) && (t = r.length)
    for (var e = 0, i = Array(t); e < t; e++) i[e] = r[e]
    return i
  }
  function E(r, t, e) {
    return (
      t in r
        ? Object.defineProperty(r, t, { value: e, enumerable: !0, configurable: !0, writable: !0 })
        : (r[t] = e),
      r
    )
  }
  function D(r) {
    return (
      (function (t) {
        if (Array.isArray(t)) return S(t)
      })(r) ||
      (function (t) {
        if ((typeof Symbol < 'u' && t[Symbol.iterator] != null) || t['@@iterator'] != null)
          return Array.from(t)
      })(r) ||
      (function (t, e) {
        if (t) {
          if (typeof t == 'string') return S(t, void 0)
          var i = Object.prototype.toString.call(t).slice(8, -1)
          if (
            (i === 'Object' && t.constructor && (i = t.constructor.name),
            i === 'Map' || i === 'Set')
          )
            return Array.from(i)
          if (i === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i))
            return S(t, void 0)
        }
      })(r) ||
      (function () {
        throw TypeError(
          'Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
        )
      })()
    )
  }
  var F = function (r, t) {
      var e = t.store,
        i = t.actions
      if (i) {
        if (e === void 0) throw Error('[mobx-miniprogram] no store specified')
        Array.isArray(i)
          ? i.forEach(function (o) {
              if (r[o]) throw Error('[mobx-miniprogram] multiple action definition')
              r[o] = function () {
                for (var s = arguments.length, c = Array(s), u = 0; u < s; u++) c[u] = arguments[u]
                return e[o].apply(e, D(c))
              }
            })
          : typeof i == 'object' &&
            Object.keys(i).forEach(function (o) {
              var s = i[o]
              if (typeof o != 'string' && typeof o != 'number')
                throw Error('[mobx-miniprogram] unrecognized field definition')
              r[o] = function () {
                for (var c = arguments.length, u = Array(c), a = 0; a < c; a++) u[a] = arguments[a]
                return e[s].apply(e, D(u))
              }
            })
      }
    },
    I = function (r, t) {
      var e = t.store,
        i = t.fields,
        o = t.structuralComparison,
        s = t.namespace || ''
      if (s && typeof s != 'string') throw Error('[mobx-miniprogram] namespace only expect string')
      var c = Object.assign({}, r[(s = s.replace(RegExp(' ', 'gm'), ''))]),
        u = o ? l.comparer.structural : void 0,
        a = null,
        B = function () {
          if (a !== null) {
            var n = a
            ;(a = null), r.setData(n)
          }
        },
        O = function (n, f) {
          if (
            (a || ((a = {}), typeof wx < 'u' ? wx.nextTick(B) : Promise.resolve().then(B)),
            s !== '')
          ) {
            var m, g
            ;(m = (function (d) {
              for (var b = 1; b < arguments.length; b++) {
                var p = arguments[b] != null ? arguments[b] : {},
                  y = Object.keys(p)
                typeof Object.getOwnPropertySymbols == 'function' &&
                  (y = y.concat(
                    Object.getOwnPropertySymbols(p).filter(function (h) {
                      return Object.getOwnPropertyDescriptor(p, h).enumerable
                    }),
                  )),
                  y.forEach(function (h) {
                    E(d, h, p[h])
                  })
              }
              return d
            })({}, c)),
              (g = (g = E({}, n, (0, l.toJS)(f))) != null ? g : {}),
              Object.getOwnPropertyDescriptors
                ? Object.defineProperties(m, Object.getOwnPropertyDescriptors(g))
                : (function (d, b) {
                    var p = Object.keys(d)
                    if (Object.getOwnPropertySymbols) {
                      var y = Object.getOwnPropertySymbols(d)
                      p.push.apply(p, y)
                    }
                    return p
                  })(Object(g)).forEach(function (d) {
                    Object.defineProperty(m, d, Object.getOwnPropertyDescriptor(g, d))
                  }),
              (c = m),
              (a[s] = c)
          } else a[n] = (0, l.toJS)(f)
        },
        A = []
      if (Array.isArray(i)) {
        if (e === void 0) throw Error('[mobx-miniprogram] no store specified')
        A = i.map(function (n) {
          return (0, l.reaction)(
            function () {
              return e[n]
            },
            function (f) {
              O(n, f)
            },
            { equals: u, fireImmediately: !0 },
          )
        })
      } else
        typeof i == 'object' &&
          i &&
          (A = Object.keys(i).map(function (n) {
            var f = i[n]
            if (typeof f == 'function')
              return (0, l.reaction)(
                function () {
                  return f.call(r, e)
                },
                function (m) {
                  O(n, m)
                },
                { equals: u, fireImmediately: !0 },
              )
            if (typeof n != 'string' && typeof n != 'number')
              throw Error('[mobx-miniprogram] unrecognized field definition')
            if (e === void 0) throw Error('[mobx-miniprogram] no store specified')
            return (0, l.reaction)(
              function () {
                return e[f]
              },
              function (m) {
                O(String(n), m)
              },
              { equals: u, fireImmediately: !0 },
            )
          }))
      return {
        updateStoreBindings: B,
        destroyStoreBindings: function () {
          A.forEach(function (n) {
            return n()
          })
        },
      }
    }
})
var q = P((_) => {
  'use strict'
  Object.defineProperty(_, '__esModule', { value: !0 }),
    Object.defineProperty(_, 'behavior', {
      enumerable: !0,
      get: function () {
        return R
      },
    })
  var v = x(),
    R = Behavior({
      definitionFilter: function (r) {
        r.methods = r.methods || {}
        var t = r.storeBindings
        ;(r.methods._mobxMiniprogramBindings = function () {
          return t
        }),
          t &&
            (Array.isArray(t)
              ? t.forEach(function (e) {
                  ;(0, v.createActions)(r.methods, e)
                })
              : (0, v.createActions)(r.methods, t))
      },
      lifetimes: {
        attached: function () {
          if (typeof this._mobxMiniprogramBindings == 'function') {
            var r = this._mobxMiniprogramBindings()
            if (!r) {
              this._mobxMiniprogramBindings = null
              return
            }
            if (Array.isArray(r)) {
              var t = this
              this._mobxMiniprogramBindings = r.map(function (e) {
                var i = (0, v.createDataFieldsReactions)(t, e)
                return i.updateStoreBindings(), i
              })
            } else
              (this._mobxMiniprogramBindings = (0, v.createDataFieldsReactions)(this, r)),
                this._mobxMiniprogramBindings.updateStoreBindings()
          }
        },
        detached: function () {
          this._mobxMiniprogramBindings &&
            (Array.isArray(this._mobxMiniprogramBindings)
              ? this._mobxMiniprogramBindings.forEach(function (r) {
                  r.destroyStoreBindings()
                })
              : this._mobxMiniprogramBindings.destroyStoreBindings())
        },
      },
      methods: {
        updateStoreBindings: function () {
          this._mobxMiniprogramBindings &&
            typeof this._mobxMiniprogramBindings != 'function' &&
            (Array.isArray(this._mobxMiniprogramBindings)
              ? this._mobxMiniprogramBindings.forEach(function (r) {
                  r.updateStoreBindings()
                })
              : this._mobxMiniprogramBindings.updateStoreBindings())
        },
      },
    })
})
Object.defineProperty(exports, '__esModule', { value: !0 }),
  (function (r, t) {
    for (var e in t) Object.defineProperty(r, e, { enumerable: !0, get: t[e] })
  })(exports, {
    BehaviorWithStore: function () {
      return C
    },
    ComponentWithStore: function () {
      return k
    },
    createStoreBindings: function () {
      return z
    },
    initStoreBindings: function () {
      return T
    },
    storeBindingsBehavior: function () {
      return J
    },
  })
var w = q(),
  M = x()
function k(r) {
  return (
    Array.isArray(r.behaviors) || (r.behaviors = []), r.behaviors.unshift(w.behavior), Component(r)
  )
}
function C(r) {
  return (
    Array.isArray(r.behaviors) || (r.behaviors = []), r.behaviors.unshift(w.behavior), Behavior(r)
  )
}
var z = function (r, t) {
    return (0, M.createActions)(r, t), (0, M.createDataFieldsReactions)(r, t)
  },
  J = w.behavior,
  T = function (r, t) {
    var e,
      i = r.self,
      o = r.lifetime
    return (
      o('attached', function () {
        ;(e = (0, M.createDataFieldsReactions)(i, t)).updateStoreBindings()
      }),
      o('detached', function () {
        e.destroyStoreBindings()
      }),
      {
        updateStoreBindings: function () {
          e && e.updateStoreBindings()
        },
      }
    )
  }
