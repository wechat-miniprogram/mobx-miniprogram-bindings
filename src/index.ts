type Action = string;
type ActionAlias = string;
type Data = string;
type StoreData = string;

// TODO Store Type
interface IStoreBindings {
  store: any;
  fields: Array<Data> | Record<Data, StoreData | ((store: any) => any)>;
  actions: Record<ActionAlias, Action> | Array<Action>;
}

type TData = WechatMiniprogram.Component.DataOption;
type TProperty = WechatMiniprogram.Component.PropertyOption;
type TMethod = WechatMiniprogram.Component.MethodOption;

type StoreOptions = (Partial<WechatMiniprogram.Component.Data<TData>> &
  Partial<WechatMiniprogram.Component.Property<TProperty>> &
  Partial<WechatMiniprogram.Component.Method<TMethod>> &
  Partial<WechatMiniprogram.Component.OtherOption> &
  Partial<WechatMiniprogram.Component.Lifetimes> & {
    storeBindings?: IStoreBindings;
  });

export function ComponentWithStore(options: StoreOptions): string {
  // TODO invoke behavior
  // if (!Array.isArray(options.behaviors)) {
  //   options.behaviors = [];
  // }
  // options.behaviors.unshift(behavior);
  return Component(options);
}

export function BehaviorWithStore(options: StoreOptions): string {
  // if (!Array.isArray(options.behaviors)) {
  //   options.behaviors = [];
  // }
  // options.behaviors.unshift(behavior);
  return Behavior(options)
}