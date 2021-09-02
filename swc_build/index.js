"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.ComponentWithStore = ComponentWithStore, exports.BehaviorWithStore = BehaviorWithStore;
var _behavior = require("./behavior");
function ComponentWithStore(a) {
    return Component(a);
}
function BehaviorWithStore(b) {
    return Array.isArray(b.behaviors) || (b.behaviors = []), b.behaviors.unshift(_behavior.behavior), Behavior(b);
}
