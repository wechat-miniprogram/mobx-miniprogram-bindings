"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataFieldsReactions = exports.createActions = void 0;
const mobx_miniprogram_1 = require("mobx-miniprogram");
const createActions = (methods, options) => {
    const { store, actions } = options;
    if (!actions)
        return;
    if (typeof store === 'undefined') {
        throw new Error('[mobx-miniprogram] no store specified');
    }
    if (Array.isArray(actions)) {
        ;
        actions.forEach((field) => {
            if (methods[field]) {
                throw new Error('[mobx-miniprogram] multiple action definition');
            }
            methods[field] = (...args) => {
                return store[field](...args);
            };
        });
    }
    else if (typeof actions === 'object') {
        Object.keys(actions).forEach((field) => {
            const def = actions[field];
            if (typeof field !== 'string' && typeof field !== 'number') {
                throw new Error('[mobx-miniprogram] unrecognized field definition');
            }
            methods[field] = (...args) => {
                return store[def](...args);
            };
        });
    }
};
exports.createActions = createActions;
const createDataFieldsReactions = (target, options) => {
    const { store, fields, structuralComparison } = options;
    let namespace = options.namespace || '';
    if (namespace && typeof namespace !== 'string') {
        throw new Error('[mobx-miniprogram] namespace only expect string');
    }
    namespace = namespace.replace(/ /gm, '');
    let namespaceData = Object.assign({}, target[namespace]);
    const useNamespace = () => {
        return namespace !== '';
    };
    const equals = structuralComparison ? mobx_miniprogram_1.comparer.structural : undefined;
    let pendingSetData = null;
    const applySetData = () => {
        if (pendingSetData === null)
            return;
        const data = pendingSetData;
        pendingSetData = null;
        target.setData(data);
    };
    const scheduleSetData = (field, value) => {
        if (!pendingSetData) {
            pendingSetData = {};
            if (typeof wx !== 'undefined')
                wx.nextTick(applySetData);
            else
                void Promise.resolve().then(applySetData);
        }
        if (useNamespace()) {
            namespaceData = {
                ...namespaceData,
                [field]: (0, mobx_miniprogram_1.toJS)(value),
            };
            pendingSetData[namespace] = namespaceData;
        }
        else {
            pendingSetData[field] = (0, mobx_miniprogram_1.toJS)(value);
        }
    };
    let reactions = [];
    if (Array.isArray(fields)) {
        if (typeof store === 'undefined') {
            throw new Error('[mobx-miniprogram] no store specified');
        }
        reactions = fields.map((field) => {
            return (0, mobx_miniprogram_1.reaction)(() => store[field], (value) => {
                scheduleSetData(field, value);
            }, {
                equals,
                fireImmediately: true,
            });
        });
    }
    else if (typeof fields === 'object' && fields) {
        reactions = Object.keys(fields).map((field) => {
            const def = fields[field];
            if (typeof def === 'function') {
                return (0, mobx_miniprogram_1.reaction)(() => def.call(target, store), (value) => {
                    scheduleSetData(field, value);
                }, {
                    equals,
                    fireImmediately: true,
                });
            }
            if (typeof field !== 'string' && typeof field !== 'number') {
                throw new Error('[mobx-miniprogram] unrecognized field definition');
            }
            if (typeof store === 'undefined') {
                throw new Error('[mobx-miniprogram] no store specified');
            }
            return (0, mobx_miniprogram_1.reaction)(() => store[def], (value) => {
                scheduleSetData(String(field), value);
            }, {
                equals,
                fireImmediately: true,
            });
        });
    }
    const destroyStoreBindings = () => {
        reactions.forEach((reaction) => {
            reaction();
        });
    };
    return {
        updateStoreBindings: applySetData,
        destroyStoreBindings,
    };
};
exports.createDataFieldsReactions = createDataFieldsReactions;
