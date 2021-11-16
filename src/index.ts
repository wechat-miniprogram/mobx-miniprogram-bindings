import { behavior } from "./behavior";
import { createActions, createDataFieldsReactions } from "./core";

type Action = string;
type ActionAlias = string;
type DataKey = string;

export interface IStoreBindings {
	namespace?: string;
	store: any;
	fields: Array<DataKey> | Record<DataKey, any | ((store: any) => any)>;
	actions: Record<ActionAlias, Action> | Array<Action>;
	structuralComparison?: boolean;
}

type ComponentWithStoreInstance<
	D extends WechatMiniprogram.Component.DataOption,
	P extends WechatMiniprogram.Component.PropertyOption,
	M extends WechatMiniprogram.Component.MethodOption,
	CP extends WechatMiniprogram.IAnyObject = Record<string, never>
> = WechatMiniprogram.Component.Instance<D, P, M, CP> & {
	data: { [K in keyof P]: any };
};

type StoreOptions<
	TData extends WechatMiniprogram.Component.DataOption,
	TProperty extends WechatMiniprogram.Component.PropertyOption,
	TMethod extends WechatMiniprogram.Component.MethodOption,
	TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {}
> = (Partial<WechatMiniprogram.Component.Data<TData>> &
	Partial<WechatMiniprogram.Component.Property<TProperty>> &
	Partial<WechatMiniprogram.Component.Method<TMethod>> &
	Partial<WechatMiniprogram.Component.OtherOption> &
	Partial<WechatMiniprogram.Component.Lifetimes> & {
		storeBindings?: IStoreBindings | Array<IStoreBindings>;
	}) &
	ThisType<
		ComponentWithStoreInstance<
			TData,
			TProperty,
			TMethod,
			TCustomInstanceProperty
		>
	>;

export function ComponentWithStore<
	TData extends WechatMiniprogram.Component.DataOption,
	TProperty extends WechatMiniprogram.Component.PropertyOption,
	TMethod extends WechatMiniprogram.Component.MethodOption,
	TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {}
>(
	options: StoreOptions<TData, TProperty, TMethod, TCustomInstanceProperty>
): string {
	if (!Array.isArray(options.behaviors)) {
		options.behaviors = [];
	}
	options.behaviors.unshift(behavior);
	return Component(options);
}

export function BehaviorWithStore<
	TData extends WechatMiniprogram.Component.DataOption,
	TProperty extends WechatMiniprogram.Component.PropertyOption,
	TMethod extends WechatMiniprogram.Component.MethodOption,
	TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {}
>(
	options: StoreOptions<TData, TProperty, TMethod, TCustomInstanceProperty>
): string {
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

export const storeBindingsBehavior = behavior;
