import * as adapter from 'glass-easel-miniprogram-adapter'
import { configure, observable, action, makeAutoObservable } from 'mobx-miniprogram'
import { behavior as computedBehavior } from 'miniprogram-computed'
import { ComponentWithStore, createStoreBindings, storeBindingsBehavior } from '../src'
import { defineComponent, renderComponent, waitTick } from './env'

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' })

const innerHTML = (component: adapter.component.GeneralComponent) => {
  return (component._$.$$ as unknown as HTMLElement).innerHTML
}

test('manually creation', async () => {
  const store = makeAutoObservable({
    numA: 1,
    numB: 2,
    get sum() {
      return this.numA + this.numB
    },
    update: function () {
      const sum = this.sum
      this.numA = this.numB
      this.numB = sum
    },
  })

  const component = renderComponent(undefined, '<view>{{a}}+{{b}}={{c}}</view>', (Component) => {
    Component({
      attached() {
        // @ts-ignore
        this.storeBindings = createStoreBindings(this, {
          store,
          fields: {
            a: 'numA',
            b: 'numB',
            c: 'sum',
          },
          actions: ['update'],
        })
      },
      detached() {
        // @ts-ignore
        this.storeBindings.destroyStoreBindings()
      },
    })
  }) as any
  await waitTick()
  expect(innerHTML(component)).toBe('<view>1+2=3</view>')

  component.update()
  component.storeBindings.updateStoreBindings()
  expect(innerHTML(component)).toBe('<view>2+3=5</view>')
})

test('declarative creation', async () => {
  const store = makeAutoObservable({
    numA: 1,
    numB: 2,
    get sum() {
      return this.numA + this.numB
    },
    update: function () {
      const sum = this.sum
      this.numA = this.numB
      this.numB = sum
    },
  })

  const component = renderComponent(
    undefined,
    '<view>{{numA}}+{{numB}}={{sum}}</view>',
    (Component) => {
      Component({
        behaviors: [storeBindingsBehavior],
        storeBindings: {
          store,
          fields: ['numA', 'numB', 'sum'],
          actions: { up: 'update' },
        },
      } as any)
    },
  ) as any
  await waitTick()
  expect(innerHTML(component)).toBe('<view>1+2=3</view>')

  component.up()
  component.updateStoreBindings()
  expect(innerHTML(component)).toBe('<view>2+3=5</view>')
})

test('destroy', async () => {
  const store = makeAutoObservable({
    numA: 1,
    numB: 2,
    get sum() {
      return this.numA + this.numB
    },
    update: function () {
      const sum = this.sum
      this.numA = this.numB
      this.numB = sum
    },
  })

  defineComponent('custom-comp', '<view>{{numA}}+{{numB}}={{sum}}</view>', (Component) => {
    Component({
      behaviors: [storeBindingsBehavior],
      storeBindings: {
        store,
        fields: ['numA', 'numB', 'sum'],
        actions: { update: 'update' },
      },
    } as any)
  })
  const component = renderComponent(undefined, '<custom-comp />', (Component) => {
    Component({
      attached() {
        // @ts-ignore
        this.storeBindings = createStoreBindings(this, { store, fields: [], actions: [] })
      },
      detached() {
        // @ts-ignore
        this.storeBindings.destroyStoreBindings()
      },
    })
  }) as any
  await waitTick()
  expect(innerHTML(component)).toBe('<custom-comp><view>1+2=3</view></custom-comp>')

  store.update()
  await waitTick()
  expect(innerHTML(component)).toBe('<custom-comp><view>2+3=5</view></custom-comp>')

  adapter.glassEasel.Element.pretendDetached(component._$)
  store.update()
  expect(innerHTML(component)).toBe('<custom-comp><view>2+3=5</view></custom-comp>')
})

test('function-typed fields binding', async () => {
  const store = makeAutoObservable({
    numA: 1,
    numB: 2,
    get sum() {
      return this.numA + this.numB
    },
    update: function () {
      const sum = this.sum
      this.numA = this.numB
      this.numB = sum
    },
  })

  const component = renderComponent(undefined, '<view>{{a}}+{{b}}={{s}}</view>', (Component) => {
    Component({
      behaviors: [storeBindingsBehavior],
      storeBindings: {
        fields: {
          a: () => store.numA,
          b: () => store.numB,
          s: () => store.sum,
        },
      },
    } as any)
  }) as any
  await waitTick()
  expect(innerHTML(component)).toBe('<view>1+2=3</view>')

  store.update()
  await waitTick()
  expect(innerHTML(component)).toBe('<view>2+3=5</view>')
})

test('binding multi store in custom components', async () => {
  const storeA = makeAutoObservable({
    a_A: 1,
    b_A: 2,
    get sum_A() {
      return this.a_A + this.b_A
    },
    update: function () {
      this.a_A = this.a_A * 10
      this.b_A = this.b_A * 10
    },
  })

  const storeB = makeAutoObservable({
    a_B: 1,
    b_B: 2,
    get sum_B() {
      return this.a_B + this.b_B
    },
    update: function () {
      this.a_B = this.a_B * 20
      this.b_B = this.b_B * 20
    },
  })

  const component = renderComponent(
    undefined,
    '<view><text>{{a_A}}+{{b_A}}={{sum_A}}</text><text>{{a_B}}+{{b_B}}={{sum_B}}</text></view>',
    (Component) => {
      Component({
        behaviors: [storeBindingsBehavior],
        storeBindings: [
          {
            store: storeA,
            fields: ['a_A', 'b_A', 'sum_A'],
            actions: { updateInStoreA: 'update' },
          },
          {
            store: storeB,
            fields: ['a_B', 'b_B', 'sum_B'],
            actions: { updateInStoreB: 'update' },
          },
        ],
      } as any)
    },
  ) as any
  await waitTick()
  expect(innerHTML(component)).toBe('<view><text>1+2=3</text><text>1+2=3</text></view>')

  component.updateInStoreA()
  component.updateInStoreB()
  component.updateStoreBindings()
  expect(innerHTML(component)).toBe('<view><text>10+20=30</text><text>20+40=60</text></view>')
})

test('structural comparison', async () => {
  const store = makeAutoObservable({
    nums: {
      a: 1,
      b: 2,
    },
    update: function () {
      this.nums = {
        a: this.nums.b,
        b: this.nums.a + this.nums.b,
      }
    },
  })

  const component = renderComponent(
    undefined,
    '<view>{{nums.a}}+{{nums.b}}</view>',
    (Component) => {
      Component({
        behaviors: [storeBindingsBehavior],
        storeBindings: {
          structuralComparison: false,
          store,
          fields: ['nums'],
          actions: ['update'],
        },
      } as any)
    },
  ) as any
  await waitTick()
  expect(innerHTML(component)).toBe('<view>1+2</view>')

  store.update()
  await waitTick()
  expect(innerHTML(component)).toBe('<view>2+3</view>')
})

test('cooperate with miniprogram-computed', async () => {
  const store = makeAutoObservable({
    nums: [1, 2, 3],
    update: function () {
      this.nums = this.nums.concat(this.nums.length + 1)
    },
  })

  const component = renderComponent(undefined, '<view>{{sum}}</view>', (Component) => {
    Component({
      behaviors: [storeBindingsBehavior, computedBehavior],
      storeBindings: {
        structuralComparison: false,
        store,
        fields: ['nums'],
        actions: ['update'],
      },
      computed: {
        sum(data) {
          const nums = data.nums
          return nums.reduce((s, o) => s + o, 0)
        },
      },
    } as any)
  }) as any
  await waitTick()
  expect(innerHTML(component)).toBe('<view>6</view>')

  component.update()
  await waitTick()
  expect(innerHTML(component)).toBe('<view>10</view>')
})

test('component with store constructor (array typing)', async () => {
  const store = makeAutoObservable({
    numA: 1,
    numB: 2,
    get sum(): number {
      return this.numA + this.numB
    },
    update: function (times: number) {
      for (let i = 0; i < times; i += 1) {
        const sum = this.sum
        this.numA = this.numB
        this.numB = sum
      }
    },
  })

  const component = renderComponent(undefined, '<view>{{sum}}</view>', (Component) => {
    ;(globalThis as any).Component = Component
    ComponentWithStore({
      storeBindings: {
        store,
        fields: ['sum'] as const,
        actions: ['update'] as const,
      },
      created() {
        this.update(1)
      },
    })
    ;(globalThis as any).Component = undefined
  }) as any
  await waitTick()
  expect(innerHTML(component)).toBe('<view>5</view>')

  component.update(2)
  await waitTick()
  expect(innerHTML(component)).toBe('<view>13</view>')
})

test('component with store constructor (map typing)', async () => {
  const store = makeAutoObservable({
    numA: 1,
    numB: 2,
    get sum(): number {
      return this.numA + this.numB
    },
    update: function (times: number) {
      for (let i = 0; i < times; i += 1) {
        const sum = this.sum
        this.numA = this.numB
        this.numB = sum
      }
    },
  })

  const component = renderComponent(undefined, '<view>{{s}}</view>', (Component) => {
    ;(globalThis as any).Component = Component
    ComponentWithStore({
      storeBindings: {
        store,
        fields: { a: () => store.numA, s: 'sum' } as const,
        actions: { up: 'update' } as const,
      },
      created() {
        this.up(1)
      },
    })
    ;(globalThis as any).Component = undefined
  }) as any
  await waitTick()
  expect(innerHTML(component)).toBe('<view>5</view>')

  component.up(2)
  await waitTick()
  expect(innerHTML(component)).toBe('<view>13</view>')
})

test('component with store constructor (multiple stores)', async () => {
  const store1 = makeAutoObservable({
    numA: 1,
    numB: 2,
    get sum(): number {
      return this.numA + this.numB
    },
    update: function (times: number) {
      for (let i = 0; i < times; i += 1) {
        const sum = this.sum
        this.numA = this.numB
        this.numB = sum
      }
    },
  })
  const store2 = makeAutoObservable({
    numA: 1,
    numB: 2,
    get sum(): number {
      return this.numA + this.numB
    },
    update: function (times: number) {
      for (let i = 0; i < times; i += 1) {
        const sum = this.sum
        this.numA = this.numB
        this.numB = sum
      }
    },
  })

  const component = renderComponent(undefined, '<view>{{sum}}</view><view>{{s}}</view>', (Component) => {
    ;(globalThis as any).Component = Component
    ComponentWithStore({
      data: {},
      storeBindings: [
        {
          store: store1,
          fields: ['sum'] as const,
          actions: ['update'] as const,
        },
        {
          store: store2,
          fields: { a: () => store2.numA, s: 'sum' } as const,
          actions: { up: 'update' } as const,
        },
      ] as const,
      created() {
        this.update(1)
        this.up(2)
      },
      attached() {
        expect(this.data.sum).toBe(5)
        expect(this.data.s).toBe(8)
      },
    })
    ;(globalThis as any).Component = undefined
  }) as any
  await waitTick()
  expect(innerHTML(component)).toBe('<view>5</view><view>8</view>')
})
