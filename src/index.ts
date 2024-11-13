import 'miniprogram-api-typings'
import { behavior } from './behavior'
import { StoreBindingsManager, createActions, createDataFieldsReactions } from './core'
import type * as adapter from 'glass-easel-miniprogram-adapter'

type Action = string

export interface IStoreBindings<T extends Record<string, any>> {
  namespace?: string
  store: T
  fields: (keyof T)[] | { [k: string]: (keyof T | ((...args: any) => any)) }
  actions: (keyof T)[] | { [k: Action]: keyof T }
  structuralComparison?: boolean
}

type StoreData<T extends IStoreBindings<any>> = T['fields'] extends string[]
  ? { [k in T['fields'][number]]: T['store'][k] }
  : T['fields'] extends { [k: Action]: string | ((...args: any) => any) }
  ? { [k in keyof T['fields']]: (
    T['fields'][k] extends (...args: any) => any
      ? ReturnType<T['fields'][k]>
      : T['fields'][k] extends string
      ? T['store'][T['fields'][k]]
      : unknown
  )}
  : unknown

type StoreAction<T extends IStoreBindings<any>> = T['actions'] extends string[]
  ? { [k in T['actions'][number]]: T['store'][k] }
  : T['actions'] extends { [k: Action]: string }
  ? { [k in keyof T['actions']]: T['store'][T['actions'][k]] }
  : unknown

type StoreOptions<
  TStoreBindings extends IStoreBindings<any>,
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TBehavior extends WechatMiniprogram.Component.BehaviorOption,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
> = (Partial<WechatMiniprogram.Component.Data<TData>> &
  Partial<WechatMiniprogram.Component.Property<TProperty>> &
  Partial<WechatMiniprogram.Component.Method<TMethod>> &
  Partial<WechatMiniprogram.Component.Behavior<TBehavior>> &
  Partial<WechatMiniprogram.Component.OtherOption> &
  Partial<WechatMiniprogram.Component.Lifetimes> & {
    storeBindings: TStoreBindings
  }) &
  ThisType<
    WechatMiniprogram.Component.Instance<
      TData & StoreData<TStoreBindings>,
      TProperty,
      TMethod & StoreAction<TStoreBindings>,
      TBehavior,
      TCustomInstanceProperty
    >
  >

type StoreListOptions<
  TStoreBindings extends IStoreBindings<any>[],
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TBehavior extends WechatMiniprogram.Component.BehaviorOption,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
> = (Partial<WechatMiniprogram.Component.Data<TData>> &
  Partial<WechatMiniprogram.Component.Property<TProperty>> &
  Partial<WechatMiniprogram.Component.Method<TMethod>> &
  Partial<WechatMiniprogram.Component.Behavior<TBehavior>> &
  Partial<WechatMiniprogram.Component.OtherOption> &
  Partial<WechatMiniprogram.Component.Lifetimes> & {
    storeBindings: TStoreBindings
  }) &
  ThisType<
    WechatMiniprogram.Component.Instance<
      TData
        & StoreData<TStoreBindings[0]>
        & StoreData<TStoreBindings[1]>
        & StoreData<TStoreBindings[2]>
        & StoreData<TStoreBindings[3]>
        & StoreData<TStoreBindings[4]>
        & StoreData<TStoreBindings[5]>
        & StoreData<TStoreBindings[6]>
        & StoreData<TStoreBindings[7]>,
      TProperty,
      TMethod
        & StoreAction<TStoreBindings[0]>
        & StoreAction<TStoreBindings[1]>
        & StoreAction<TStoreBindings[2]>
        & StoreAction<TStoreBindings[3]>
        & StoreAction<TStoreBindings[4]>
        & StoreAction<TStoreBindings[5]>
        & StoreAction<TStoreBindings[6]>
        & StoreAction<TStoreBindings[7]>,
      TBehavior,
      TCustomInstanceProperty
    >
  >

export function ComponentWithStore<
  TStoreBindings extends IStoreBindings<any>,
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TBehavior extends WechatMiniprogram.Component.BehaviorOption,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
>(options: StoreOptions<TStoreBindings, TData, TProperty, TMethod, TBehavior, TCustomInstanceProperty>): string;
export function ComponentWithStore<
  TStoreBindings extends IStoreBindings<any>[],
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TBehavior extends WechatMiniprogram.Component.BehaviorOption,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
>(options: StoreListOptions<TStoreBindings, TData, TProperty, TMethod, TBehavior, TCustomInstanceProperty>): string;
export function ComponentWithStore<
  TStoreBindings extends any,
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TBehavior extends WechatMiniprogram.Component.BehaviorOption,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
>(options: StoreListOptions<any, TData, TProperty, TMethod, TBehavior, TCustomInstanceProperty>): string {
  if (!Array.isArray(options.behaviors)) {
    options.behaviors = [] as any
  }
  (options.behaviors as any).unshift(behavior)
  return Component(options)
}

export function BehaviorWithStore<
  TStoreBindings extends IStoreBindings<any>,
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TBehavior extends WechatMiniprogram.Component.BehaviorOption,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
>(options: StoreOptions<TStoreBindings, TData, TProperty, TMethod, TBehavior, TCustomInstanceProperty>): string;
export function BehaviorWithStore<
  TStoreBindings extends IStoreBindings<any>[],
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TBehavior extends WechatMiniprogram.Component.BehaviorOption,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
>(options: StoreListOptions<TStoreBindings, TData, TProperty, TMethod, TBehavior, TCustomInstanceProperty>): string;
export function BehaviorWithStore<
  TStoreBindings extends any,
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TBehavior extends WechatMiniprogram.Component.BehaviorOption,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
>(options: StoreListOptions<any, TData, TProperty, TMethod, TBehavior, TCustomInstanceProperty>): string {
  if (!Array.isArray(options.behaviors)) {
    options.behaviors = [] as any
  }
  (options.behaviors as any).unshift(behavior)
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
