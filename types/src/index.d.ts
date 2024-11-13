import 'miniprogram-api-typings';
import { StoreBindingsManager } from './core';
import type * as adapter from 'glass-easel-miniprogram-adapter';
type Action = string;
export interface IStoreBindings<T extends Record<string, any>> {
    namespace?: string;
    store: T;
    fields: (keyof T)[] | {
        [k: string]: (keyof T | ((...args: any) => any));
    };
    actions: (keyof T)[] | {
        [k: Action]: keyof T;
    };
    structuralComparison?: boolean;
}
type StoreData<T extends IStoreBindings<any>> = T['fields'] extends string[] ? {
    [k in T['fields'][number]]: T['store'][k];
} : T['fields'] extends {
    [k: Action]: string | ((...args: any) => any);
} ? {
    [k in keyof T['fields']]: (T['fields'][k] extends (...args: any) => any ? ReturnType<T['fields'][k]> : T['fields'][k] extends string ? T['store'][T['fields'][k]] : unknown);
} : unknown;
type StoreAction<T extends IStoreBindings<any>> = T['actions'] extends string[] ? {
    [k in T['actions'][number]]: T['store'][k];
} : T['actions'] extends {
    [k: Action]: string;
} ? {
    [k in keyof T['actions']]: T['store'][T['actions'][k]];
} : unknown;
type StoreOptions<TStoreBindings extends IStoreBindings<any>, TData extends WechatMiniprogram.Component.DataOption, TProperty extends WechatMiniprogram.Component.PropertyOption, TMethod extends WechatMiniprogram.Component.MethodOption, TBehavior extends WechatMiniprogram.Component.BehaviorOption, TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {}> = (Partial<WechatMiniprogram.Component.Data<TData>> & Partial<WechatMiniprogram.Component.Property<TProperty>> & Partial<WechatMiniprogram.Component.Method<TMethod>> & Partial<WechatMiniprogram.Component.Behavior<TBehavior>> & Partial<WechatMiniprogram.Component.OtherOption> & Partial<WechatMiniprogram.Component.Lifetimes> & {
    storeBindings: TStoreBindings;
}) & ThisType<WechatMiniprogram.Component.Instance<TData & StoreData<TStoreBindings>, TProperty, TMethod & StoreAction<TStoreBindings>, TBehavior, TCustomInstanceProperty>>;
type StoreListOptions<TStoreBindings extends IStoreBindings<any>[], TData extends WechatMiniprogram.Component.DataOption, TProperty extends WechatMiniprogram.Component.PropertyOption, TMethod extends WechatMiniprogram.Component.MethodOption, TBehavior extends WechatMiniprogram.Component.BehaviorOption, TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {}> = (Partial<WechatMiniprogram.Component.Data<TData>> & Partial<WechatMiniprogram.Component.Property<TProperty>> & Partial<WechatMiniprogram.Component.Method<TMethod>> & Partial<WechatMiniprogram.Component.Behavior<TBehavior>> & Partial<WechatMiniprogram.Component.OtherOption> & Partial<WechatMiniprogram.Component.Lifetimes> & {
    storeBindings: TStoreBindings;
}) & ThisType<WechatMiniprogram.Component.Instance<TData & StoreData<TStoreBindings[0]> & StoreData<TStoreBindings[1]> & StoreData<TStoreBindings[2]> & StoreData<TStoreBindings[3]> & StoreData<TStoreBindings[4]> & StoreData<TStoreBindings[5]> & StoreData<TStoreBindings[6]> & StoreData<TStoreBindings[7]>, TProperty, TMethod & StoreAction<TStoreBindings[0]> & StoreAction<TStoreBindings[1]> & StoreAction<TStoreBindings[2]> & StoreAction<TStoreBindings[3]> & StoreAction<TStoreBindings[4]> & StoreAction<TStoreBindings[5]> & StoreAction<TStoreBindings[6]> & StoreAction<TStoreBindings[7]>, TBehavior, TCustomInstanceProperty>>;
export declare function ComponentWithStore<TStoreBindings extends IStoreBindings<any>, TData extends WechatMiniprogram.Component.DataOption, TProperty extends WechatMiniprogram.Component.PropertyOption, TMethod extends WechatMiniprogram.Component.MethodOption, TBehavior extends WechatMiniprogram.Component.BehaviorOption, TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {}>(options: StoreOptions<TStoreBindings, TData, TProperty, TMethod, TBehavior, TCustomInstanceProperty>): string;
export declare function ComponentWithStore<TStoreBindings extends IStoreBindings<any>[], TData extends WechatMiniprogram.Component.DataOption, TProperty extends WechatMiniprogram.Component.PropertyOption, TMethod extends WechatMiniprogram.Component.MethodOption, TBehavior extends WechatMiniprogram.Component.BehaviorOption, TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {}>(options: StoreListOptions<TStoreBindings, TData, TProperty, TMethod, TBehavior, TCustomInstanceProperty>): string;
export declare function BehaviorWithStore<TStoreBindings extends IStoreBindings<any>, TData extends WechatMiniprogram.Component.DataOption, TProperty extends WechatMiniprogram.Component.PropertyOption, TMethod extends WechatMiniprogram.Component.MethodOption, TBehavior extends WechatMiniprogram.Component.BehaviorOption, TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {}>(options: StoreOptions<TStoreBindings, TData, TProperty, TMethod, TBehavior, TCustomInstanceProperty>): string;
export declare function BehaviorWithStore<TStoreBindings extends IStoreBindings<any>[], TData extends WechatMiniprogram.Component.DataOption, TProperty extends WechatMiniprogram.Component.PropertyOption, TMethod extends WechatMiniprogram.Component.MethodOption, TBehavior extends WechatMiniprogram.Component.BehaviorOption, TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {}>(options: StoreListOptions<TStoreBindings, TData, TProperty, TMethod, TBehavior, TCustomInstanceProperty>): string;
export declare const createStoreBindings: <TStore extends Record<string, any>>(target: any, options: IStoreBindings<TStore>) => StoreBindingsManager;
export declare const storeBindingsBehavior: WechatMiniprogram.Behavior.BehaviorIdentifier<WechatMiniprogram.Component.DataOption, WechatMiniprogram.Component.PropertyOption, {
    updateStoreBindings(): void;
}, WechatMiniprogram.Component.BehaviorOption>;
export type InitializedStoreBindings = {
    updateStoreBindings: () => void;
};
export declare const initStoreBindings: <TStore extends Record<string, any>>(ctx: adapter.builder.BuilderContext<any, any, any>, options: Omit<IStoreBindings<TStore>, "actions">) => InitializedStoreBindings;
export {};
