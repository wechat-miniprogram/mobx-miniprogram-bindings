import { behavior } from "./behavior";
import { createActions, createDataFieldsReactions } from "./core";

type Action = string;
type ActionAlias = string;
type Data = string;
type StoreData = string;

// TODO Store Type
export interface IStoreBindings {
  namespace?: string;
  store: any;
  fields: Array<Data> | Record<Data, StoreData | ((store: any) => any)>;
  actions: Record<ActionAlias, Action> | Array<Action>;
  structuralComparison?: boolean;
}

type TData = WechatMiniprogram.Component.DataOption;
type TProperty = WechatMiniprogram.Component.PropertyOption;
type TMethod = WechatMiniprogram.Component.MethodOption;

type StoreOptions = Partial<WechatMiniprogram.Component.Data<TData>> &
  Partial<WechatMiniprogram.Component.Property<TProperty>> &
  Partial<WechatMiniprogram.Component.Method<TMethod>> &
  Partial<WechatMiniprogram.Component.OtherOption> &
  Partial<WechatMiniprogram.Component.Lifetimes> & {
    storeBindings?: IStoreBindings | Array<IStoreBindings>;
  };

export function ComponentWithStore(options: StoreOptions): string {
  // TODO invoke behavior
  if (!Array.isArray(options.behaviors)) {
    options.behaviors = [];
  }
  options.behaviors.unshift(behavior);
  return Component(options);
}

export function BehaviorWithStore(options: StoreOptions): string {
  if (!Array.isArray(options.behaviors)) {
    options.behaviors = [];
  }
  options.behaviors.unshift(behavior);
  return Behavior(options);
}

export const createStoreBindings = (target, options) => {
  createActions(target, options);
  return createDataFieldsReactions(target, options);
};
