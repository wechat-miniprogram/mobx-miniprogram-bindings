import { createStoreBindings } from '../../../../src/index'
import { user } from '../../models'
Component({
  options: {
    styleIsolation: 'shared'
  },
  data: {
    someData: '...'
  },
  attached() {
    this.storeBindings = createStoreBindings(this, {
      namespace: "user_store",
      store: user,
      fields: {
        numA: "numA",
        numB: (store) => {return store.numB},
        sum: "sum",
      },
      actions: {
        buttonTap: "update_user",
      },
    },)
  }
})
