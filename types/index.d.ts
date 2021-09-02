/// <reference types="wechat-miniprogram" />
declare type Action = string;
declare type ActionAlias = string;
declare type Data = string;
declare type StoreData = string;
interface IStoreBindings {
    store: any;
    fields: Array<Data> | Record<Data, StoreData | ((store: any) => any)>;
    actions: Record<ActionAlias, Action> | Array<Action>;
}
declare type TData = WechatMiniprogram.Component.DataOption;
declare type TProperty = WechatMiniprogram.Component.PropertyOption;
declare type TMethod = WechatMiniprogram.Component.MethodOption;
declare type StoreOptions = (Partial<WechatMiniprogram.Component.Data<TData>> & Partial<WechatMiniprogram.Component.Property<TProperty>> & Partial<WechatMiniprogram.Component.Method<TMethod>> & Partial<WechatMiniprogram.Component.OtherOption> & Partial<WechatMiniprogram.Component.Lifetimes> & {
    storeBindings?: IStoreBindings;
});
export declare function ComponentWithStore(options: StoreOptions): string;
export declare function BehaviorWithStore(options: StoreOptions): string;
export {};
