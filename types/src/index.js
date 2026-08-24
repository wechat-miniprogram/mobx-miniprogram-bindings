"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStoreBindings = exports.storeBindingsBehavior = exports.createStoreBindings = void 0;
exports.ComponentWithStore = ComponentWithStore;
exports.BehaviorWithStore = BehaviorWithStore;
require("miniprogram-api-typings");
const behavior_1 = require("./behavior");
const core_1 = require("./core");
function ComponentWithStore(options) {
    if (!Array.isArray(options.behaviors)) {
        options.behaviors = [];
    }
    ;
    options.behaviors.unshift(behavior_1.behavior);
    return Component(options);
}
function BehaviorWithStore(options) {
    if (!Array.isArray(options.behaviors)) {
        options.behaviors = [];
    }
    ;
    options.behaviors.unshift(behavior_1.behavior);
    return Behavior(options);
}
const createStoreBindings = (target, options) => {
    (0, core_1.createActions)(target, options);
    return (0, core_1.createDataFieldsReactions)(target, options);
};
exports.createStoreBindings = createStoreBindings;
exports.storeBindingsBehavior = behavior_1.behavior;
const initStoreBindings = (ctx, options) => {
    const { self, lifetime } = ctx;
    let storeBindings;
    lifetime('attached', () => {
        storeBindings = (0, core_1.createDataFieldsReactions)(self, options);
        storeBindings.updateStoreBindings();
    });
    lifetime('detached', () => {
        storeBindings.destroyStoreBindings();
    });
    return {
        updateStoreBindings: () => {
            if (storeBindings) {
                storeBindings.updateStoreBindings();
            }
        },
    };
};
exports.initStoreBindings = initStoreBindings;
