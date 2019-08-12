# 小程序的 MobX 绑定辅助库

小程序的 MobX 绑定辅助库。

> 此 behavior 依赖开发者工具的 npm 构建。具体详情可查阅[官方 npm 文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)。

## 使用方法

需要小程序基础库版本 >= 2.2.3 的环境。

也可以直接参考这个代码片段（在微信开发者工具中打开）： [https://developers.weixin.qq.com/s/qPXsfumH7ta4](https://developers.weixin.qq.com/s/qPXsfumH7ta4) 。

1. 安装 `mobx-miniprogram` 和 `mobx-miniprogram-bindings` ：

```
npm install --save mobx-miniprogram mobx-miniprogram-bindings
```

2. 创建 MobX Store。

```js
// store.js
import { observable, action } from 'mobx-miniprogram'

export const store = observable({

  // 数据字段
  numA: 1,
  numB: 2,

  // 计算属性
  get sum() {
    return this.numA + this.numB
  },

  // actions
  update: action(function () {
    const sum = this.sum
    this.numA = this.numB
    this.numB = sum
  })

})
```

3. 在 Component 构造器中使用：

```js
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from './store'

Component({
  behaviors: [storeBindingsBehavior],
  data: {
    someData: '...'
  },
  storeBindings: {
    store,
    fields: {
      numA: () => store.numA,
      numB: (store) => store.numB,
      sum: 'sum'
    },
    actions: {
      buttonTap: 'update'
    },
  }
})
```

4. 在 Page 构造器中使用：

```js
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from './store'

Page({
  data: {
    someData: '...'
  },
  onLoad() {
    this.destroyStoreBindings = createStoreBindings(this, {
      store,
      fields: ['numA', 'numB', 'sum'],
      actions: ['update'],
    })
  },
  onUnload() {
    this.destroyStoreBindings()
  }
})
```

## 接口说明

TODO
