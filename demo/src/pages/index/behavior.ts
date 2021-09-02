import { BehaviorWithStore } from "../../../../src/index";
import { global, user } from "../../models/index";
export const testBehavior = BehaviorWithStore({
  storeBindings: [{
    namespace: "global",
    store: global,
    fields: ["numA", "numB", "sum"],
    actions: ["update"],
  }, {
    store: user,
    fields: ["numA", "numB", "sum"],
    actions: ["update_user"],
  },]
});
