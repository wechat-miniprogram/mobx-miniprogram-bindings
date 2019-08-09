import {reaction} from 'mobx-miniprogram'

function _createActions(methods, options) {
  const {store, actions} = options

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
  } else if (typeof actions === 'object' && actions) {
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
  let reactions
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

  const destoryStoreBindings = () => {
    reactions.forEach((reaction) => reaction())
  }
  return destoryStoreBindings
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
    const options = defFields.storeBindings
    _createActions(defFields.methods, options)
    defFields.methods._mobxMiniprogramBindings = function () {
      return options
    }
  },
  attached() {
    if (typeof this._mobxMiniprogramBindings !== 'function') return
    const storeBindings = this._mobxMiniprogramBindings()
    const destoryStoreBindings = _createDataFieldsReactions(this, storeBindings)
    this._mobxMiniprogramBindings = {
      destoryStoreBindings
    }
  },
  detached() {
    if (this._mobxMiniprogramBindings) {
      this._mobxMiniprogramBindings.destoryStoreBindings()
    }
  },
})
