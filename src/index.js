import {reaction} from 'mobx-miniprogram'

function _createActions(methods, options) {
  const {store, actions} = options

  if (!actions) return

  // for array-typed fields definition
  if (typeof store === 'undefined') {
    throw new Error('[mobx-miniprogram] no store specified')
  }

  if (actions instanceof Array) {
    // eslint-disable-next-line arrow-body-style
    actions.forEach((field) => {
      methods[field] = function (...args) {
        store[field](...args)
      }
    })
  } else if (typeof actions === 'object') {
    // for object-typed fields definition
    Object.keys(actions).forEach((field) => {
      const def = actions[field]
      if (typeof field !== 'string' && typeof field !== 'number') {
        throw new Error('[mobx-miniprogram] unrecognized field definition')
      }
      methods[field] = function (...args) {
        store[def](...args)
      }
    })
  }
}

function _createDataFieldsReactions(target, options) {
  const {store, fields} = options

  // setData combination
  let pendingSetData = null
  function applySetData() {
    if (pendingSetData === null) return
    const data = pendingSetData
    pendingSetData = null
    target.setData(data)
  }
  function scheduleSetData(field, value) {
    if (!pendingSetData) {
      pendingSetData = {}
      wx.nextTick(applySetData)
    }
    pendingSetData[field] = value
  }

  // handling fields
  let reactions = []
  if (fields instanceof Array) {
    // for array-typed fields definition
    if (typeof store === 'undefined') {
      throw new Error('[mobx-miniprogram] no store specified')
    }
    // eslint-disable-next-line arrow-body-style
    reactions = fields.map((field) => {
      return reaction(() => store[field], (value) => {
        scheduleSetData(field, value)
      }, {
        fireImmediately: true
      })
    })
  } else if (typeof fields === 'object' && fields) {
    // for object-typed fields definition
    reactions = Object.keys(fields).map((field) => {
      const def = fields[field]
      if (typeof def === 'function') {
        return reaction(() => def.call(target, store), (value) => {
          scheduleSetData(field, value)
        }, {
          fireImmediately: true
        })
      }
      if (typeof field !== 'string' && typeof field !== 'number') {
        throw new Error('[mobx-miniprogram] unrecognized field definition')
      }
      if (typeof store === 'undefined') {
        throw new Error('[mobx-miniprogram] no store specified')
      }
      return reaction(() => store[def], (value) => {
        scheduleSetData(String(field), value)
      }, {
        fireImmediately: true
      })
    })
  }

  const destroyStoreBindings = () => {
    reactions.forEach((reaction) => reaction())
  }

  return {
    updateStoreBindings: applySetData,
    destroyStoreBindings
  }
}

export function createStoreBindings(target, options) {
  _createActions(target, options)
  return _createDataFieldsReactions(target, options)
}

export const storeBindingsBehavior = Behavior({
  definitionFilter: (defFields) => {
    if (!defFields.methods) {
      defFields.methods = {}
    }
    const storeBindings = defFields.storeBindings
    defFields.methods._mobxMiniprogramBindings = function () {
      return storeBindings
    }
    if (storeBindings) {
      _createActions(defFields.methods, storeBindings)
    }
  },
  attached() {
    if (typeof this._mobxMiniprogramBindings !== 'function') return
    const storeBindings = this._mobxMiniprogramBindings()
    if (!storeBindings) {
      this._mobxMiniprogramBindings = null
      return
    }
    this._mobxMiniprogramBindings = _createDataFieldsReactions(this, storeBindings)
  },
  detached() {
    if (this._mobxMiniprogramBindings) {
      this._mobxMiniprogramBindings.destroyStoreBindings()
    }
  },
  methods: {
    updateStoreBindings() {
      if (this._mobxMiniprogramBindings && typeof this._mobxMiniprogramBindings !== 'function') {
        this._mobxMiniprogramBindings.updateStoreBindings()
      }
    }
  }
})
