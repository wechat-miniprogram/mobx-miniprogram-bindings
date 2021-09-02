import { reaction, comparer, toJS } from "mobx-miniprogram";

const createActions = (methods, options) => {
  const { store, actions } = options;
  if (!actions) return;

  // for array-typed fields definition
  if (typeof store === "undefined") {
    throw new Error("[mobx-miniprogram] no store specified");
  }

  if (Array.isArray(actions)) {
    actions.forEach((field) => {
      methods[field] = (...args) => {
        return store[field](...args);
      };
    });
  } else if (typeof actions === "object") {
    Object.keys(actions).forEach((field) => {
      const def = actions[field];
      if (typeof field !== "string" && typeof field !== "number") {
        throw new Error("[mobx-miniprogram] unrecognized field definition");
      }
      methods[field] = (...args) => {
        return store[def](...args);
      };
    });
  }
};
const createDataFieldsReactions = (target, options) => {
  const { store, fields, structuralComparison } = options;
  // choose equal method
  const equals = structuralComparison ? comparer.structural : undefined;
  // setData combination
  let pendingSetData = null;
  const applySetData = () => {
    if (pendingSetData === null) return;
    const data = pendingSetData;
    pendingSetData = null;
    target.setData(data);
  };
  const scheduleSetData = (field, value) => {
    if (!pendingSetData) {
      pendingSetData = {};
      wx.nextTick(applySetData);
    }
    pendingSetData[field] = toJS(value);
  };
  // handling fields
  let reactions = [];
  if (Array.isArray(fields)) {
    // for array-typed fields definition
    if (typeof store === "undefined") {
      throw new Error("[mobx-miniprogram] no store specified");
    }
    reactions = fields.map((field) => {
      return reaction(
        () => store[field],
        (value) => {
          scheduleSetData(field, value);
        },
        {
          equals,
          fireImmediately: true,
        }
      );
    });
  } else if (typeof fields === "object" && fields) {
    // for object-typed fields definition
    reactions = Object.keys(fields).map((field) => {
      const def = fields[field];
      if (typeof def === "function") {
        return reaction(
          () => def.call(target, store),
          (value) => {
            scheduleSetData(field, value);
          },
          {
            equals,
            fireImmediately: true,
          }
        );
      }
    });
  }

  const destroyStoreBindings = () => {
    reactions.forEach((reaction) => reaction());
  };

  return {
    updateStoreBindings: applySetData,
    destroyStoreBindings,
  };
};
export const createStoreBindings = (target, options) => {
  createActions(target, options);
  return createDataFieldsReactions(target, options);
};

export const behavior = Behavior({
  definitionFilter: (defFields: any) => {
    defFields.methods = defFields.methods || {};
    const { storeBindings } = defFields;
    defFields.methods._mobxMiniprogramBindings = () => {
      return storeBindings;
    };
    if (storeBindings) {
      if (Array.isArray(storeBindings)) {
        storeBindings.forEach((binding) => {
          createActions(defFields.methods, binding);
        });
      } else {
        createActions(defFields.methods, storeBindings);
      }
    }
  },
  lifetimes: {
    attached() {
      if (typeof this._mobxMiniprogramBindings !== "function") return;
      const storeBindings = this._mobxMiniprogramBindings();
      if (!storeBindings) {
        this._mobxMiniprogramBindings = null;
        return;
      }
      if (Array.isArray(storeBindings)) {
        const that = this;
        this._mobxMiniprogramBindings = storeBindings.map((item) => {
          const ret = createDataFieldsReactions(that, item);
          ret.updateStoreBindings();
          return ret;
        });
      } else {
        this._mobxMiniprogramBindings = createDataFieldsReactions(
          this,
          storeBindings
        );
        this._mobxMiniprogramBindings.updateStoreBindings();
      }
    },
    detached() {
      if (this._mobxMiniprogramBindings) {
        if (Array.isArray(this._mobxMiniprogramBindings)) {
          this._mobxMiniprogramBindings.forEach((item) => {
            item.destroyStoreBindings();
          });
        } else {
          this._mobxMiniprogramBindings.destroyStoreBindings();
        }
      }
    },
  },
  methods: {
    updateStoreBindings() {
      if (
        this._mobxMiniprogramBindings &&
        typeof this._mobxMiniprogramBindings !== "function"
      ) {
        if (Array.isArray(this._mobxMiniprogramBindings)) {
          this._mobxMiniprogramBindings.forEach((item) => {
            item.updateStoreBindings();
          });
        } else {
          this._mobxMiniprogramBindings.updateStoreBindings();
        }
      }
    },
  },
});
