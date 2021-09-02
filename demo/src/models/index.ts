import { configure } from 'mobx-miniprogram'
export { global } from './global'
export { user } from './user'

configure({ enforceActions: "observed" });
