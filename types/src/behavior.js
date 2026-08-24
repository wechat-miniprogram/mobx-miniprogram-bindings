"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.behavior = void 0;
require("miniprogram-api-typings");
const core_1 = require("./core");
exports.behavior = Behavior({
    definitionFilter: (defFields) => {
        defFields.methods = defFields.methods || {};
        const { storeBindings } = defFields;
        defFields.storeBindings = undefined;
        if (storeBindings) {
            defFields.methods._mobxMiniprogramBindings = () => {
                return storeBindings;
            };
            if (Array.isArray(storeBindings)) {
                storeBindings.forEach((binding) => {
                    (0, core_1.createActions)(defFields.methods, binding);
                });
            }
            else {
                (0, core_1.createActions)(defFields.methods, storeBindings);
            }
        }
    },
    lifetimes: {
        attached() {
            const self = this;
            if (typeof self._mobxMiniprogramBindings !== 'function')
                return;
            const storeBindings = self._mobxMiniprogramBindings();
            if (!storeBindings) {
                self._mobxMiniprogramBindings = null;
                return;
            }
            if (Array.isArray(storeBindings)) {
                self._mobxMiniprogramBindings = storeBindings.map((item) => {
                    const ret = (0, core_1.createDataFieldsReactions)(self, item);
                    ret.updateStoreBindings();
                    return ret;
                });
            }
            else {
                self._mobxMiniprogramBindings = (0, core_1.createDataFieldsReactions)(this, storeBindings);
                self._mobxMiniprogramBindings.updateStoreBindings();
            }
        },
        detached() {
            const self = this;
            if (self._mobxMiniprogramBindings) {
                if (Array.isArray(self._mobxMiniprogramBindings)) {
                    self._mobxMiniprogramBindings.forEach((item) => {
                        item.destroyStoreBindings();
                    });
                }
                else {
                    self._mobxMiniprogramBindings.destroyStoreBindings();
                }
            }
        },
    },
    methods: {
        updateStoreBindings() {
            const self = this;
            if (self._mobxMiniprogramBindings && typeof self._mobxMiniprogramBindings !== 'function') {
                if (Array.isArray(self._mobxMiniprogramBindings)) {
                    self._mobxMiniprogramBindings.forEach((item) => {
                        item.updateStoreBindings();
                    });
                }
                else {
                    self._mobxMiniprogramBindings.updateStoreBindings();
                }
            }
        },
    },
});
