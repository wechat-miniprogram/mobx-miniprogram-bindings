import { ComponentConstructor } from 'glass-easel-miniprogram-adapter'
import { initStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../store'

declare const Component: ComponentConstructor

Component()
  .init((ctx) => {
    const { listener } = ctx

    initStoreBindings(ctx, {
      store,
      fields: ['numA', 'numB', 'sum'],
    })

    const buttonTap = listener(() => {
      store.update()
    })

    return { buttonTap }
  })
  .register()
