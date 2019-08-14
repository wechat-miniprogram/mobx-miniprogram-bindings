const {configure, observable, action} = require('mobx-miniprogram')
const _ = require('./utils')
const {storeBindingsBehavior, createStoreBindings} = require('../src/index')

// 不允许在动作外部修改状态
configure({enforceActions: 'observed'})

test('manually creation', async () => {
  const store = observable({
    numA: 1,
    numB: 2,
    get sum() {
      return this.numA + this.numB
    },
    update: action(function () {
      const sum = this.sum
      this.numA = this.numB
      this.numB = sum
    })
  })

  const componentId = _.load({
    template: '<view>{{a}}+{{b}}={{c}}</view>',
    attached() {
      this.storeBindings = createStoreBindings(this, {
        store,
        fields: {
          a: 'numA',
          b: 'numB',
          c: 'sum'
        },
        actions: ['update']
      })
    },
    detached() {
      this.storeBindings.destroyStoreBindings()
    }
  })
  const component = _.render(componentId)
  const parent = document.createElement('div')
  component.attach(parent)

  await new Promise((resolve) => {
    wx.nextTick(() => {
      expect(_.match(component.dom, '<wx-view>1+2=3</wx-view>')).toBe(true)

      component.instance.update()
      component.instance.storeBindings.updateStoreBindings()
      expect(_.match(component.dom, '<wx-view>2+3=5</wx-view>')).toBe(true)

      resolve()
    })
  })
})

test('declarative creation', async () => {
  const store = observable({
    numA: 1,
    numB: 2,
    get sum() {
      return this.numA + this.numB
    },
    update: action(function () {
      const sum = this.sum
      this.numA = this.numB
      this.numB = sum
    })
  })

  const componentId = _.load({
    template: '<view>{{numA}}+{{numB}}={{sum}}</view>',
    behaviors: [storeBindingsBehavior],
    storeBindings: {
      store,
      fields: ['numA', 'numB', 'sum'],
      actions: {up: 'update'}
    }
  })
  const component = _.render(componentId)
  const parent = document.createElement('div')
  component.attach(parent)

  await new Promise((resolve) => {
    wx.nextTick(() => {
      expect(_.match(component.dom, '<wx-view>1+2=3</wx-view>')).toBe(true)

      component.instance.up()
      component.instance.updateStoreBindings()
      expect(_.match(component.dom, '<wx-view>2+3=5</wx-view>')).toBe(true)

      resolve()
    })
  })
})

test('destroy', async () => {
  const store = observable({
    numA: 1,
    numB: 2,
    get sum() {
      return this.numA + this.numB
    },
    update: action(function () {
      const sum = this.sum
      this.numA = this.numB
      this.numB = sum
    })
  })

  _.load({
    id: 'custom-comp',
    template: '<view>{{numA}}+{{numB}}={{sum}}</view>',
    behaviors: [storeBindingsBehavior],
    storeBindings: {
      store,
      fields: ['numA', 'numB', 'sum'],
      actions: {update: 'update'}
    }
  })
  const componentId = _.load({
    template: '<custom-comp />',
    attached() {
      this.storeBindings = createStoreBindings(this, {})
    },
    detached() {
      this.storeBindings.destroyStoreBindings()
    }
  })
  const component = _.render(componentId)
  const parent = document.createElement('div')
  component.attach(parent)

  await new Promise((resolve) => {
    wx.nextTick(() => {
      expect(_.match(component.dom, '<custom-comp><wx-view>1+2=3</wx-view></custom-comp>')).toBe(true)

      store.update()
      wx.nextTick(() => {
        expect(_.match(component.dom, '<custom-comp><wx-view>2+3=5</wx-view></custom-comp>')).toBe(true)
        const child = component.dom.childNodes[0]
        expect(_.match(child, '<wx-view>2+3=5</wx-view>')).toBe(true)

        component.detach()
        store.update()
        wx.nextTick(() => {
          expect(_.match(component.dom, '<custom-comp><wx-view>2+3=5</wx-view></custom-comp>')).toBe(true)
          expect(_.match(child, '<wx-view>2+3=5</wx-view>')).toBe(true)
          resolve()
        })
      })
    })
  })
})

test('function-typed fields binding', async () => {
  const store = observable({
    numA: 1,
    numB: 2,
    get sum() {
      return this.numA + this.numB
    },
    update: action(function () {
      const sum = this.sum
      this.numA = this.numB
      this.numB = sum
    })
  })

  const componentId = _.load({
    template: '<view>{{a}}+{{b}}={{s}}</view>',
    behaviors: [storeBindingsBehavior],
    storeBindings: {
      fields: {
        a: () => store.numA,
        b: () => store.numB,
        s: () => store.sum,
      }
    }
  })
  const component = _.render(componentId)
  const parent = document.createElement('div')
  component.attach(parent)

  await new Promise((resolve) => {
    wx.nextTick(() => {
      expect(_.match(component.dom, '<wx-view>1+2=3</wx-view>')).toBe(true)

      store.update()
      wx.nextTick(() => {
        expect(_.match(component.dom, '<wx-view>2+3=5</wx-view>')).toBe(true)

        resolve()
      })
    })
  })
})
