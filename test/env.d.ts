import * as adapter from 'glass-easel-miniprogram-adapter'

export const renderComponent: (
  path: string | undefined,
  template: string,
  f: (Component: adapter.ComponentConstructor, env: adapter.ComponentEnv) => void,
) => adapter.glassEasel.GeneralComponent

export const defineComponent: (
  path: string | undefined,
  template: string,
  f: (Component: adapter.ComponentConstructor, env: adapter.ComponentEnv) => void,
) => adapter.glassEasel.GeneralComponent

export const waitTick: () => Promise<void>
