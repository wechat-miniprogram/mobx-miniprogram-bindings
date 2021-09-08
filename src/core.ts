import { reaction, comparer, toJS } from "mobx-miniprogram";
import { IStoreBindings } from "./index";

export const createActions = (methods, options: IStoreBindings) => {
  const { store, actions } = options;
  if (!actions) return;

  // for array-typed fields definition
  if (typeof store === "undefined") {
    throw new Error("[mobx-miniprogram] no store specified");
  }

  if (Array.isArray(actions)) {
    actions.forEach((field) => {
      if (methods[field]) {
        throw new Error("[mobx-miniprogram] multiple action definition");
      }
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

export const createDataFieldsReactions = (target, options: IStoreBindings) => {
  const { store, fields, structuralComparison } = options;

  // if use namespace
  let namespace = options.namespace || "";
  if (namespace && typeof namespace !== "string") {
    throw new Error("[mobx-miniprogram] namespace only expect string");
  }
  namespace = namespace.replace(new RegExp(" ","gm"),"");

  let namespaceData = Object.assign({}, target[namespace]);

  const useNamespace = (): boolean => {
    return namespace !== "";
  };

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
    if (useNamespace()) {
      namespaceData = {
        ...namespaceData,
        [field]: toJS(value),
      };
      pendingSetData[namespace] = namespaceData;
    } else {
      pendingSetData[field] = toJS(value);
    }
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
      if (typeof field !== "string" && typeof field !== "number") {
        throw new Error("[mobx-miniprogram] unrecognized field definition");
      }
      if (typeof store === "undefined") {
        throw new Error("[mobx-miniprogram] no store specified");
      }
      return reaction(
        () => store[def],
        (value) => {
          scheduleSetData(String(field), value);
        },
        {
          equals,
          fireImmediately: true,
        }
      );
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
