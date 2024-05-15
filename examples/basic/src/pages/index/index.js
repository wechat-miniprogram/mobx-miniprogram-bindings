import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../store'

Component({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: ['numA', 'numB', 'sum'],
    actions: {
      buttonTap: 'update',
    },
  },
})
