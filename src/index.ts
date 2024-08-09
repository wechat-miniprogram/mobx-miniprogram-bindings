import 'miniprogram-api-typings'
import { behavior } from './behavior'
import { StoreBindingsManager, createActions, createDataFieldsReactions } from './core'
import type * as adapter from 'glass-easel-miniprogram-adapter'

type Action = string
type ActionAlias = string
type DataKey = string

export interface IStoreBindings<T extends Record<string, any>> {
  namespace?: string
  store: T
  fields: (keyof T)[] | { [k: string]: (keyof T | ((...args: any[]) => any)) }
  actions: (keyof T)[] | { [k: Action]: keyof T }
  structuralComparison?: boolean
}

type StoreAction<TStore extends Record<string, any>, T extends IStoreBindings<TStore>> = T['actions'] extends string[]
  ? { [k in T['actions'][number]]: TStore[k] }
  : T['actions'] extends { [k: Action]: string }
  ? { [k in keyof T['actions']]: TStore[T['actions'][k]] }
  : unknown

type ComponentWithStoreInstance<
  D extends WechatMiniprogram.Component.DataOption,
  P extends WechatMiniprogram.Component.PropertyOption,
  M extends WechatMiniprogram.Component.MethodOption,
  CP extends WechatMiniprogram.IAnyObject = Record<string, never>,
> = WechatMiniprogram.Component.Instance<D, P, M, CP> & {
  data: { [K in keyof P]: any }
}

type StoreOptions<
  TStore extends Record<string, any>,
  TStoreBindings extends IStoreBindings<TStore>,
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
> = (Partial<WechatMiniprogram.Component.Data<TData>> &
  Partial<WechatMiniprogram.Component.Property<TProperty>> &
  Partial<WechatMiniprogram.Component.Method<TMethod>> &
  Partial<WechatMiniprogram.Component.OtherOption> &
  Partial<WechatMiniprogram.Component.Lifetimes> & {
    storeBindings: TStoreBindings
  }) &
  ThisType<ComponentWithStoreInstance<TData, TProperty, TMethod, TCustomInstanceProperty>>

export function ComponentWithStore<
  TStore extends Record<string, any>,
  TStoreBindings extends IStoreBindings<TStore>,
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
>(options: StoreOptions<TStore, TStoreBindings, TData, TProperty, TMethod, TCustomInstanceProperty>): string {
  if (!Array.isArray(options.behaviors)) {
    options.behaviors = []
  }
  options.behaviors.unshift(behavior)
  return Component(options)
}

export function BehaviorWithStore<
  TStore extends Record<string, any>,
  TStoreBindings extends IStoreBindings<TStore>,
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
>(options: StoreOptions<TStore, TStoreBindings, TData, TProperty, TMethod, TCustomInstanceProperty>): string {
  if (!Array.isArray(options.behaviors)) {
    options.behaviors = []
  }
  options.behaviors.unshift(behavior)
  return Behavior(options)
}

export const createStoreBindings = <TStore extends Record<string, any>>(target, options: IStoreBindings<TStore>): StoreBindingsManager => {
  createActions(target, options)
  return createDataFieldsReactions(target, options)
}

export const storeBindingsBehavior = behavior

export type InitializedStoreBindings = {
  updateStoreBindings: () => void
}

export const initStoreBindings = <TStore extends Record<string, any>>(
  ctx: adapter.builder.BuilderContext<any, any, any>,
  options: Omit<IStoreBindings<TStore>, 'actions'>,
): InitializedStoreBindings => {
  const { self, lifetime } = ctx

  let storeBindings: StoreBindingsManager | undefined
  lifetime('attached', () => {
    storeBindings = createDataFieldsReactions(self, options)
    storeBindings.updateStoreBindings()
  })
  lifetime('detached', () => {
    storeBindings!.destroyStoreBindings()
  })

  return {
    updateStoreBindings: () => {
      if (storeBindings) {
        storeBindings.updateStoreBindings()
      }
    },
  }
}
