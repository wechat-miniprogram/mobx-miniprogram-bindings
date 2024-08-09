import 'miniprogram-api-typings'
import { IStoreBindings } from './index'
import { createActions, createDataFieldsReactions, StoreBindingsManager } from './core'

type TDefFields = WechatMiniprogram.Component.TrivialOption & {
  storeBindings?: IStoreBindings<any> | Array<IStoreBindings<any>>
}

type UninitializedThis = {
  updateStoreBindings: () => void
  _mobxMiniprogramBindings: (() => IStoreBindings<any>) | StoreBindingsManager | StoreBindingsManager[] | null
}

type InitializedThis = {
  updateStoreBindings: () => void
  _mobxMiniprogramBindings: StoreBindingsManager | StoreBindingsManager[] | null
}

export const behavior = Behavior({
  definitionFilter: (defFields: TDefFields) => {
    defFields.methods = defFields.methods || {}
    const { storeBindings } = defFields
    defFields.methods._mobxMiniprogramBindings = () => {
      return storeBindings
    }
    if (storeBindings) {
      if (Array.isArray(storeBindings)) {
        storeBindings.forEach((binding) => {
          createActions(defFields.methods, binding)
        })
      } else {
        createActions(defFields.methods, storeBindings)
      }
    }
  },
  lifetimes: {
    attached() {
      const self = this as unknown as UninitializedThis
      if (typeof self._mobxMiniprogramBindings !== 'function') return
      const storeBindings = self._mobxMiniprogramBindings()
      if (!storeBindings) {
        self._mobxMiniprogramBindings = null
        return
      }
      if (Array.isArray(storeBindings)) {
        self._mobxMiniprogramBindings = storeBindings.map((item) => {
          const ret = createDataFieldsReactions(self, item)
          ret.updateStoreBindings()
          return ret
        })
      } else {
        self._mobxMiniprogramBindings = createDataFieldsReactions(this, storeBindings)
        self._mobxMiniprogramBindings.updateStoreBindings()
      }
    },
    detached() {
      const self = this as unknown as InitializedThis
      if (self._mobxMiniprogramBindings) {
        if (Array.isArray(self._mobxMiniprogramBindings)) {
          self._mobxMiniprogramBindings.forEach((item) => {
            item.destroyStoreBindings()
          })
        } else {
          self._mobxMiniprogramBindings.destroyStoreBindings()
        }
      }
    },
  },
  methods: {
    updateStoreBindings() {
      const self = this as unknown as UninitializedThis
      if (self._mobxMiniprogramBindings && typeof self._mobxMiniprogramBindings !== 'function') {
        if (Array.isArray(self._mobxMiniprogramBindings)) {
          self._mobxMiniprogramBindings.forEach((item) => {
            item.updateStoreBindings()
          })
        } else {
          self._mobxMiniprogramBindings.updateStoreBindings()
        }
      }
    },
  },
})
