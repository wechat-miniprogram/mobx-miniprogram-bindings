import { IStoreBindings } from "./index";
import { createActions, createDataFieldsReactions } from "./core";

type TDefFields = WechatMiniprogram.Component.TrivialOption & {
  storeBindings?: IStoreBindings | Array<IStoreBindings>;
};

export const behavior = Behavior({
  definitionFilter: (defFields: TDefFields) => {
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
