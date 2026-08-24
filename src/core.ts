import { reaction, comparer, toJS } from 'mobx-miniprogram'
import type { IStoreBindings } from './index'

export const createActions = <TStore extends Record<string, any>>(
  methods: Record<string, any>,
  options: IStoreBindings<TStore>,
) => {
  const { store, actions } = options
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!actions) return

  // for array-typed fields definition
  if (typeof store === 'undefined') {
    throw new Error('[mobx-miniprogram] no store specified')
  }

  if (Array.isArray(actions)) {
    ;(actions as string[]).forEach((field) => {
      if (methods[field]) {
        throw new Error('[mobx-miniprogram] multiple action definition')
      }
      methods[field] = (...args: any[]) => {
        return (store[field] as (...args: unknown[]) => unknown)(...args)
      }
    })
  } else if (typeof actions === 'object') {
    Object.keys(actions).forEach((field) => {
      const def = actions[field]
      if (typeof field !== 'string' && typeof field !== 'number') {
        throw new Error('[mobx-miniprogram] unrecognized field definition')
      }
      methods[field] = (...args: any[]) => {
        return (store[def] as (...args: unknown[]) => unknown)(...args)
      }
    })
  }
}

export type StoreBindingsManager = {
  updateStoreBindings: () => void
  destroyStoreBindings: () => void
}

export const createDataFieldsReactions = <TStore extends Record<string, any>>(
  target: WechatMiniprogram.Component.Instance<any, any, any, any>,
  options: Omit<IStoreBindings<TStore>, 'actions'>,
): StoreBindingsManager => {
  const { store, fields, structuralComparison } = options

  // if use namespace
  let namespace = options.namespace || ''
  if (namespace && typeof namespace !== 'string') {
    throw new Error('[mobx-miniprogram] namespace only expect string')
  }
  namespace = namespace.replace(/ /gm, '')

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  let namespaceData = Object.assign({}, target[namespace])

  const useNamespace = (): boolean => {
    return namespace !== ''
  }

  // choose equal method
  const equals = structuralComparison ? comparer.structural : undefined

  // setData combination
  let pendingSetData: Record<string, any> | null = null

  const applySetData = () => {
    if (pendingSetData === null) return
    const data = pendingSetData
    pendingSetData = null
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    target.setData(data)
  }

  const scheduleSetData = (field: string, value: unknown) => {
    if (!pendingSetData) {
      pendingSetData = {}
      if (typeof wx !== 'undefined') wx.nextTick(applySetData)
      else void Promise.resolve().then(applySetData)
    }
    if (useNamespace()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      namespaceData = {
        ...namespaceData,
        [field]: toJS(value),
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      pendingSetData[namespace] = namespaceData
    } else {
      pendingSetData[field] = toJS(value)
    }
  }

  // handling fields
  let reactions: (() => void)[] = []

  if (Array.isArray(fields)) {
    // for array-typed fields definition
    if (typeof store === 'undefined') {
      throw new Error('[mobx-miniprogram] no store specified')
    }
    reactions = fields.map((field) => {
      return reaction(
        () => store[field],
        (value) => {
          scheduleSetData(field as string, value)
        },
        {
          equals,
          fireImmediately: true,
        },
      )
    })
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (typeof fields === 'object' && fields) {
    // for object-typed fields definition
    reactions = Object.keys(fields).map((field) => {
      const def = fields[field]
      if (typeof def === 'function') {
        return reaction(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          () => def.call(target, store),
          (value) => {
            scheduleSetData(field, value)
          },
          {
            equals,
            fireImmediately: true,
          },
        )
      }
      if (typeof field !== 'string' && typeof field !== 'number') {
        throw new Error('[mobx-miniprogram] unrecognized field definition')
      }
      if (typeof store === 'undefined') {
        throw new Error('[mobx-miniprogram] no store specified')
      }
      return reaction(
        () => store[def],
        (value) => {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-conversion
          scheduleSetData(String(field), value)
        },
        {
          equals,
          fireImmediately: true,
        },
      )
    })
  }

  const destroyStoreBindings = () => {
    reactions.forEach((reaction) => {
      reaction()
    })
  }

  return {
    updateStoreBindings: applySetData,
    destroyStoreBindings,
  }
}
