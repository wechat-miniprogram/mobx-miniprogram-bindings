/// <reference types="wechat-miniprogram" />
declare type Action = string;
declare type ActionAlias = string;
declare type DataKey = string;
export interface IStoreBindings {
    namespace?: string;
    store: any;
    fields: Array<DataKey> | Record<DataKey, any | ((store: any) => any)>;
    actions: Record<ActionAlias, Action> | Array<Action>;
    structuralComparison?: boolean;
}
declare type ComponentWithStoreInstance<D extends WechatMiniprogram.Component.DataOption, P extends WechatMiniprogram.Component.PropertyOption, M extends WechatMiniprogram.Component.MethodOption, CP extends WechatMiniprogram.IAnyObject = Record<string, never>> = WechatMiniprogram.Component.Instance<D, P, M, CP> & {
    data: {
        [K in keyof P]: any;
    };
};
declare type StoreOptions<TData extends WechatMiniprogram.Component.DataOption, TProperty extends WechatMiniprogram.Component.PropertyOption, TMethod extends WechatMiniprogram.Component.MethodOption, TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {}> = (Partial<WechatMiniprogram.Component.Data<TData>> & Partial<WechatMiniprogram.Component.Property<TProperty>> & Partial<WechatMiniprogram.Component.Method<TMethod>> & Partial<WechatMiniprogram.Component.OtherOption> & Partial<WechatMiniprogram.Component.Lifetimes> & {
    storeBindings?: IStoreBindings | Array<IStoreBindings>;
}) & ThisType<ComponentWithStoreInstance<TData, TProperty, TMethod, TCustomInstanceProperty>>;
export declare function ComponentWithStore<TData extends WechatMiniprogram.Component.DataOption, TProperty extends WechatMiniprogram.Component.PropertyOption, TMethod extends WechatMiniprogram.Component.MethodOption, TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {}>(options: StoreOptions<TData, TProperty, TMethod, TCustomInstanceProperty>): string;
export declare function BehaviorWithStore<TData extends WechatMiniprogram.Component.DataOption, TProperty extends WechatMiniprogram.Component.PropertyOption, TMethod extends WechatMiniprogram.Component.MethodOption, TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {}>(options: StoreOptions<TData, TProperty, TMethod, TCustomInstanceProperty>): string;
export declare const createStoreBindings: (target: any, options: any) => {
    updateStoreBindings: () => void;
    destroyStoreBindings: () => void;
};
export declare const storeBindingsBehavior: string;
export {};
