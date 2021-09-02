import { ComponentWithStore } from '../../../../src/index'
import { global } from '../../models'
ComponentWithStore({
  options: {
    styleIsolation: 'shared'
  },
  data: {
    someData: '...'
  },
  storeBindings: {
    store: global,
    fields: ["numA", "numB", "sum"],
    actions: {
      buttonTap: "update",
    },
  },
})
