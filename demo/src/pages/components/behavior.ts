import { BehaviorWithStore } from "../../../../src/index";
import { store } from "../models/store";

export const testBehavior = BehaviorWithStore({
  storeBindings: {
    store,
    fields: ["numA", "numB", "sum"],
    actions: {
      buttonTap: "update",
    },
  },
});
