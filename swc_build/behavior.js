"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.behavior = void 0;
var _core = require("./core"), behavior = Behavior({
    definitionFilter: function(a) {
        a.methods = a.methods || {
        };
        var b = a.storeBindings;
        a.methods._mobxMiniprogramBindings = function() {
            return b;
        }, b && (Array.isArray(b) ? b.forEach(function(c) {
            _core.createActions(a.methods, c);
        }) : _core.createActions(a.methods, b));
    },
    lifetimes: {
        attached: function() {
            if ("function" == typeof this._mobxMiniprogramBindings) {
                var d = this._mobxMiniprogramBindings();
                if (!d) return void (this._mobxMiniprogramBindings = null);
                if (Array.isArray(d)) {
                    var e = this;
                    this._mobxMiniprogramBindings = d.map(function(f) {
                        var g = _core.createDataFieldsReactions(e, f);
                        return g.updateStoreBindings(), g;
                    });
                } else this._mobxMiniprogramBindings = _core.createDataFieldsReactions(this, d), this._mobxMiniprogramBindings.updateStoreBindings();
            }
        },
        detached: function() {
            this._mobxMiniprogramBindings && (Array.isArray(this._mobxMiniprogramBindings) ? this._mobxMiniprogramBindings.forEach(function(h) {
                h.destroyStoreBindings();
            }) : this._mobxMiniprogramBindings.destroyStoreBindings());
        }
    },
    methods: {
        updateStoreBindings: function() {
            this._mobxMiniprogramBindings && "function" != typeof this._mobxMiniprogramBindings && (Array.isArray(this._mobxMiniprogramBindings) ? this._mobxMiniprogramBindings.forEach(function(i) {
                i.updateStoreBindings();
            }) : this._mobxMiniprogramBindings.updateStoreBindings());
        }
    }
});
exports.behavior = behavior;
