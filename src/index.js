import {reaction, comparer, toJS} from 'mobx-miniprogram'

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
        return store[field](...args)
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
        return store[def](...args)
      }
    })
  }
}

function _createDataFieldsReactions(target, options) {
  const {store, fields, structuralComparison} = options

  // choose equal method
  const equals = structuralComparison ? comparer.structural : undefined

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
    pendingSetData[field] = toJS(value)
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
        equals,
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
          equals,
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
        equals,
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
    const {storeBindings} = defFields
    defFields.methods._mobxMiniprogramBindings = function () {
      return storeBindings
    }
    if (storeBindings) {
      if (Array.isArray(storeBindings)) {
        storeBindings.forEach(function (binding) {
          _createActions(defFields.methods, binding)
        })
      } else {
        _createActions(defFields.methods, storeBindings)
      }
    }
  },
  attached() {
    if (typeof this._mobxMiniprogramBindings !== 'function') return
    const storeBindings = this._mobxMiniprogramBindings()
    if (!storeBindings) {
      this._mobxMiniprogramBindings = null
      return
    }
    if (Array.isArray(storeBindings)) {
      const that = this
      this._mobxMiniprogramBindings = storeBindings.map(function (item) {
        const ret = _createDataFieldsReactions(that, item)
        ret.updateStoreBindings()
        return ret
      })
    } else {
      this._mobxMiniprogramBindings = _createDataFieldsReactions(this, storeBindings)
      this._mobxMiniprogramBindings.updateStoreBindings()
    }
  },
  detached() {
    if (this._mobxMiniprogramBindings) {
      if (Array.isArray(this._mobxMiniprogramBindings)) {
        this._mobxMiniprogramBindings.forEach(function (bd) {
          bd.destroyStoreBindings()
        })
      } else {
        this._mobxMiniprogramBindings.destroyStoreBindings()
      }
    }
  },
  methods: {
    updateStoreBindings() {
      if (this._mobxMiniprogramBindings && typeof this._mobxMiniprogramBindings !== 'function') {
        if (Array.isArray(this._mobxMiniprogramBindings)) {
          this._mobxMiniprogramBindings.forEach(function (bd) {
            bd.updateStoreBindings()
          })
        } else {
          this._mobxMiniprogramBindings.updateStoreBindings()
        }
      }
    }
  }
})
