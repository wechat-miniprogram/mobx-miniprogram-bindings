import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { store } from '../../store'

ComponentWithStore({
  storeBindings: {
    store,
    fields: ['numA', 'numB', 'sum'],
    actions: {
      buttonTap: 'update',
    },
  },
})
