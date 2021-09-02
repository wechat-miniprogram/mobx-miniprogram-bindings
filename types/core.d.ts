import { IStoreBindings } from "./index";
export declare const createActions: (methods: any, options: IStoreBindings) => void;
export declare const createDataFieldsReactions: (target: any, options: IStoreBindings) => {
    updateStoreBindings: () => void;
    destroyStoreBindings: () => void;
};
