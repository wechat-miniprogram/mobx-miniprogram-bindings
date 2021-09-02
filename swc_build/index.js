"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.ComponentWithStore = ComponentWithStore, exports.BehaviorWithStore = BehaviorWithStore, exports.createStoreBindings = void 0;
var _behavior = require("./behavior"), _core = require("./core");
function ComponentWithStore(a) {
    return Array.isArray(a.behaviors) || (a.behaviors = []), a.behaviors.unshift(_behavior.behavior), Component(a);
}
function BehaviorWithStore(b) {
    return Array.isArray(b.behaviors) || (b.behaviors = []), b.behaviors.unshift(_behavior.behavior), Behavior(b);
}
var createStoreBindings = function(c, d) {
    return _core.createActions(c, d), _core.createDataFieldsReactions(c, d);
};
exports.createStoreBindings = createStoreBindings;
