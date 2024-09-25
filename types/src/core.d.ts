import { IStoreBindings } from './index';
export declare const createActions: <TStore extends Record<string, any>>(methods: any, options: IStoreBindings<TStore>) => void;
export type StoreBindingsManager = {
    updateStoreBindings: () => void;
    destroyStoreBindings: () => void;
};
export declare const createDataFieldsReactions: <TStore extends Record<string, any>>(target: any, options: Omit<IStoreBindings<TStore>, "actions">) => StoreBindingsManager;
