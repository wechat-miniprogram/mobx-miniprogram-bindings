/// <reference types="wechat-miniprogram" />
/// <reference types="wechat-miniprogram" />
import { StoreBindingsManager } from './core'
import type * as adapter from 'glass-easel-miniprogram-adapter'
type Action = string
type ActionAlias = string
type DataKey = string
export interface IStoreBindings {
  namespace?: string
  store: any
  fields: Array<DataKey> | Record<DataKey, any | ((store: any) => any)>
  actions: Record<ActionAlias, Action> | Array<Action>
  structuralComparison?: boolean
}
type ComponentWithStoreInstance<
  D extends WechatMiniprogram.Component.DataOption,
  P extends WechatMiniprogram.Component.PropertyOption,
  M extends WechatMiniprogram.Component.MethodOption,
  CP extends WechatMiniprogram.IAnyObject = Record<string, never>,
> = WechatMiniprogram.Component.Instance<D, P, M, CP> & {
  data: {
    [K in keyof P]: any
  }
}
type StoreOptions<
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
> = (Partial<WechatMiniprogram.Component.Data<TData>> &
  Partial<WechatMiniprogram.Component.Property<TProperty>> &
  Partial<WechatMiniprogram.Component.Method<TMethod>> &
  Partial<WechatMiniprogram.Component.OtherOption> &
  Partial<WechatMiniprogram.Component.Lifetimes> & {
    storeBindings?: IStoreBindings | Array<IStoreBindings>
  }) &
  ThisType<ComponentWithStoreInstance<TData, TProperty, TMethod, TCustomInstanceProperty>>
export declare function ComponentWithStore<
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
>(options: StoreOptions<TData, TProperty, TMethod, TCustomInstanceProperty>): string
export declare function BehaviorWithStore<
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
>(options: StoreOptions<TData, TProperty, TMethod, TCustomInstanceProperty>): string
export declare const createStoreBindings: (
  target: any,
  options: IStoreBindings,
) => StoreBindingsManager
export declare const storeBindingsBehavior: string
export type InitializedStoreBindings = {
  updateStoreBindings: () => void
}
export declare const initStoreBindings: (
  ctx: adapter.builder.BuilderContext<any, any, any>,
  options: Omit<IStoreBindings, 'actions'>,
) => InitializedStoreBindings
export {}
