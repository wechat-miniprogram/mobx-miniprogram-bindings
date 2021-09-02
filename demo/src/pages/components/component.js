import { ComponentWithStore } from '../../../../src/index'
import { store } from '../models/store'
ComponentWithStore({
  options: {
    styleIsolation: 'shared'
  },
  data: {
    someData: '...'
  },
  storeBindings: {
    store,
    fields: ["numA", "numB", "sum"],
    actions: {
      buttonTap: "update",
    },
  },
})
