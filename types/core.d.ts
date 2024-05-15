import { IStoreBindings } from './index'
export declare const createActions: (methods: any, options: IStoreBindings) => void
export type StoreBindingsManager = {
  updateStoreBindings: () => void
  destroyStoreBindings: () => void
}
export declare const createDataFieldsReactions: (
  target: any,
  options: Omit<IStoreBindings, 'actions'>,
) => StoreBindingsManager
