"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.behavior = exports.createStoreBindings = void 0;
var _store, _store1, _mobxMiniprogram = require("mobx-miniprogram");
function _arrayWithoutHoles(a) {
    if (Array.isArray(a)) {
        for(var b = 0, c = new Array(a.length); b < a.length; b++)c[b] = a[b];
        return c;
    }
}
function _iterableToArray(d) {
    if (Symbol.iterator in Object(d) || "[object Arguments]" === Object.prototype.toString.call(d)) return Array.from(d);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _toConsumableArray(a) {
    return _arrayWithoutHoles(a) || _iterableToArray(a) || _nonIterableSpread();
}
var createActions = function(e, f) {
    var g = f.store, h = f.actions;
    if (h) {
        if (void 0 === g) throw new Error("[mobx-miniprogram] no store specified");
        Array.isArray(h) ? h.forEach(function(i) {
            e[i] = function() {
                for(var j = arguments.length, k = new Array(j), l = 0; l < j; l++)k[l] = arguments[l];
                return (_store = g)[i].apply(_store, _toConsumableArray(k));
            };
        }) : "object" == typeof h && Object.keys(h).forEach(function(m) {
            var n = h[m];
            if ("string" != typeof m && "number" != typeof m) throw new Error("[mobx-miniprogram] unrecognized field definition");
            e[m] = function() {
                for(var o = arguments.length, p = new Array(o), q = 0; q < o; q++)p[q] = arguments[q];
                return (_store1 = g)[n].apply(_store1, _toConsumableArray(p));
            };
        });
    }
}, createDataFieldsReactions = function(r, s) {
    var t = s.store, u = s.fields, v = s.structuralComparison ? _mobxMiniprogram.comparer.structural : void 0, w = null, x = function() {
        if (null !== w) {
            var y = w;
            w = null, r.setData(y);
        }
    }, z = function(A, B) {
        w || (w = {
        }, wx.nextTick(x)), w[A] = _mobxMiniprogram.toJS(B);
    }, C = [];
    if (Array.isArray(u)) {
        if (void 0 === t) throw new Error("[mobx-miniprogram] no store specified");
        C = u.map(function(D) {
            return _mobxMiniprogram.reaction(function() {
                return t[D];
            }, function(E) {
                z(D, E);
            }, {
                equals: v,
                fireImmediately: !0
            });
        });
    } else "object" == typeof u && u && (C = Object.keys(u).map(function(F) {
        var G = u[F];
        if ("function" == typeof G) return _mobxMiniprogram.reaction(function() {
            return G.call(r, t);
        }, function(H) {
            z(F, H);
        }, {
            equals: v,
            fireImmediately: !0
        });
    }));
    return {
        updateStoreBindings: x,
        destroyStoreBindings: function() {
            C.forEach(function(I) {
                return I();
            });
        }
    };
}, createStoreBindings = function(J, K) {
    return createActions(J, K), createDataFieldsReactions(J, K);
};
exports.createStoreBindings = createStoreBindings;
var behavior = Behavior({
    definitionFilter: function(L) {
        L.methods = L.methods || {
        };
        var M = L.storeBindings;
        L.methods._mobxMiniprogramBindings = function() {
            return M;
        }, M && (Array.isArray(M) ? M.forEach(function(N) {
            createActions(L.methods, N);
        }) : createActions(L.methods, M));
    },
    lifetimes: {
        attached: function() {
            if ("function" == typeof this._mobxMiniprogramBindings) {
                var O = this._mobxMiniprogramBindings();
                if (!O) return void (this._mobxMiniprogramBindings = null);
                if (Array.isArray(O)) {
                    var P = this;
                    this._mobxMiniprogramBindings = O.map(function(Q) {
                        var R = createDataFieldsReactions(P, Q);
                        return R.updateStoreBindings(), R;
                    });
                } else this._mobxMiniprogramBindings = createDataFieldsReactions(this, O), this._mobxMiniprogramBindings.updateStoreBindings();
            }
        },
        detached: function() {
            this._mobxMiniprogramBindings && (Array.isArray(this._mobxMiniprogramBindings) ? this._mobxMiniprogramBindings.forEach(function(S) {
                S.destroyStoreBindings();
            }) : this._mobxMiniprogramBindings.destroyStoreBindings());
        }
    },
    methods: {
        updateStoreBindings: function() {
            this._mobxMiniprogramBindings && "function" != typeof this._mobxMiniprogramBindings && (Array.isArray(this._mobxMiniprogramBindings) ? this._mobxMiniprogramBindings.forEach(function(T) {
                T.updateStoreBindings();
            }) : this._mobxMiniprogramBindings.updateStoreBindings());
        }
    }
});
exports.behavior = behavior;
