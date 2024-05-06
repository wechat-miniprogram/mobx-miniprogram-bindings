import { ComponentWithStore, storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../store'

ComponentWithStore({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: ["numA", "numB", "sum"],
    actions: {
      buttonTap: "update",
    },
  }
})
