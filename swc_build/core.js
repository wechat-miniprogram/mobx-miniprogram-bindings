"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.createActions = exports.createDataFieldsReactions = void 0;
var _store, _store1, _mobxMiniprogram = require("mobx-miniprogram");
function _arrayWithoutHoles(a) {
    if (Array.isArray(a)) {
        for(var b = 0, c = new Array(a.length); b < a.length; b++)c[b] = a[b];
        return c;
    }
}
function _defineProperty(d, e, f) {
    return e in d ? Object.defineProperty(d, e, {
        value: f,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : d[e] = f, d;
}
function _iterableToArray(g) {
    if (Symbol.iterator in Object(g) || "[object Arguments]" === Object.prototype.toString.call(g)) return Array.from(g);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _objectSpread(h) {
    for(var b = 1; b < arguments.length; b++){
        var i = null != arguments[b] ? arguments[b] : {
        }, j = Object.keys(i);
        "function" == typeof Object.getOwnPropertySymbols && (j = j.concat(Object.getOwnPropertySymbols(i).filter(function(k) {
            return Object.getOwnPropertyDescriptor(i, k).enumerable;
        }))), j.forEach(function(e) {
            _defineProperty(h, e, i[e]);
        });
    }
    return h;
}
function _toConsumableArray(a) {
    return _arrayWithoutHoles(a) || _iterableToArray(a) || _nonIterableSpread();
}
var createActions = function(l, m) {
    var n = m.store, o = m.actions;
    if (o) {
        if (void 0 === n) throw new Error("[mobx-miniprogram] no store specified");
        Array.isArray(o) ? o.forEach(function(p) {
            if (l[p]) throw new Error("[mobx-miniprogram] multiple action definition");
            l[p] = function() {
                for(var q = arguments.length, r = new Array(q), s = 0; s < q; s++)r[s] = arguments[s];
                return (_store = n)[p].apply(_store, _toConsumableArray(r));
            };
        }) : "object" == typeof o && Object.keys(o).forEach(function(t) {
            var u = o[t];
            if ("string" != typeof t && "number" != typeof t) throw new Error("[mobx-miniprogram] unrecognized field definition");
            l[t] = function() {
                for(var v = arguments.length, w = new Array(v), x = 0; x < v; x++)w[x] = arguments[x];
                return (_store1 = n)[u].apply(_store1, _toConsumableArray(w));
            };
        });
    }
};
exports.createActions = createActions;
var createDataFieldsReactions = function(y, z) {
    var A = z.store, B = z.fields, C = z.structuralComparison, D = z.namespace || "";
    if (D && "string" != typeof D) throw new Error("[mobx-miniprogram] namespace only expect string");
    D = D.replaceAll(" ", "");
    var E = Object.assign({
    }, y[D]), F = C ? _mobxMiniprogram.comparer.structural : void 0, G = null, H = function() {
        if (null !== G) {
            var I = G;
            G = null, y.setData(I);
        }
    }, J = function(K, L) {
        G || (G = {
        }, wx.nextTick(H)), "" !== D ? (E = _objectSpread({
        }, E, _defineProperty({
        }, K, _mobxMiniprogram.toJS(L))), G[D] = E) : G[K] = _mobxMiniprogram.toJS(L);
    }, M = [];
    if (Array.isArray(B)) {
        if (void 0 === A) throw new Error("[mobx-miniprogram] no store specified");
        M = B.map(function(N) {
            return _mobxMiniprogram.reaction(function() {
                return A[N];
            }, function(O) {
                J(N, O);
            }, {
                equals: F,
                fireImmediately: !0
            });
        });
    } else "object" == typeof B && B && (M = Object.keys(B).map(function(P) {
        var Q = B[P];
        if ("function" == typeof Q) return _mobxMiniprogram.reaction(function() {
            return Q.call(y, A);
        }, function(R) {
            J(P, R);
        }, {
            equals: F,
            fireImmediately: !0
        });
        if ("string" != typeof P && "number" != typeof P) throw new Error("[mobx-miniprogram] unrecognized field definition");
        if (void 0 === A) throw new Error("[mobx-miniprogram] no store specified");
        return _mobxMiniprogram.reaction(function() {
            return A[Q];
        }, function(S) {
            J(String(P), S);
        }, {
            equals: F,
            fireImmediately: !0
        });
    }));
    return {
        updateStoreBindings: H,
        destroyStoreBindings: function() {
            M.forEach(function(T) {
                return T();
            });
        }
    };
};
exports.createDataFieldsReactions = createDataFieldsReactions;
