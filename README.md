# 小程序的 MobX 绑定辅助库

小程序的 MobX 绑定辅助库。

> 此 behavior 依赖开发者工具的 npm 构建。具体详情可查阅 [官方 npm 文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html) 。

> 可配合 MobX 的小程序构建版 npm 模块 [`mobx-miniprogram`](https://github.com/wechat-miniprogram/mobx) 使用。

## 使用方法

需要小程序基础库版本 >= 2.2.3 的环境。

也可以直接参考这个代码片段（在微信开发者工具中打开）： [https://developers.weixin.qq.com/s/nGvWJ2mL7et0](https://developers.weixin.qq.com/s/nGvWJ2mL7et0) 。

1. 安装 `mobx-miniprogram` 和 `mobx-miniprogram-bindings` ：

```shell
npm install --save mobx-miniprogram mobx-miniprogram-bindings
```

2. 创建 MobX Store。

```js
// store.js
import { observable, action } from "mobx-miniprogram";

export const store = observable({
  // 数据字段
  numA: 1,
  numB: 2,

  // 计算属性
  get sum() {
    return this.numA + this.numB;
  },

  // actions
  update: action(function () {
    const sum = this.sum;
    this.numA = this.numB;
    this.numB = sum;
  }),
});
```

3. 在 Component 构造器中使用：

```js
import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "./store";

Component({
  behaviors: [storeBindingsBehavior],
  data: {
    someData: "...",
  },
  storeBindings: {
    store,
    fields: {
      numA: () => store.numA,
      numB: (store) => store.numB,
      sum: "sum",
    },
    actions: {
      buttonTap: "update",
    },
  },
  methods: {
    myMethod() {
      this.data.sum; // 来自于 MobX store 的字段
    },
  },
});
```

4. 在 Page 构造器中使用：

如果小程序基础库版本在 2.9.2 以上，可以直接像上面 Component 构造器那样引入 behaviors 。

如果需要比较好的兼容性，可以使用下面这种方式（或者直接改用 Component 构造器来创建页面）。

```js
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "./store";

Page({
  data: {
    someData: "...",
  },
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["numA", "numB", "sum"],
      actions: ["update"],
    });
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },
  myMethod() {
    this.data.sum; // 来自于 MobX store 的字段
  },
});
```

## Typescript 支持

从 `2.1.2` 版本开始提供了简单的 `TypeScript` 支持。

新增两个构造器 `API`，推荐优先使用下列新版接口，你也可以继续使用旧版接口，详见接口说明。

### ComponentWithStore

```js
import { ComponentWithStore } from "mobx-miniprogram-binding";
ComponentWithStore({
  options: {
    styleIsolation: "shared",
  },
  data: {
    someData: "...",
  },
  storeBindings: {
    store,
    fields: ["numA", "numB", "sum"],
    actions: {
      buttonTap: "update",
    },
  },
});
```

### BehaviorWithStore

```js
import { BehaviorWithStore } from "mobx-miniprogram-binding";
export const testBehavior = BehaviorWithStore({
  storeBindings: {
    store,
    fields: ["numA", "numB", "sum"],
    actions: ["update"],
  },
});
```

## 接口

将页面、自定义组件和 store 绑定有两种方式： **behavior 绑定** 和 **手工绑定** 。

### behavior 绑定

**behavior 绑定** 适用于 `Component` 构造器。做法：使用 `storeBindingsBehavior` 这个 behavior 和 `storeBindings` 定义段。

注意：你可以用 `Component` 构造器构造页面， [参考文档](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html#%E4%BD%BF%E7%94%A8-Component-%E6%9E%84%E9%80%A0%E5%99%A8%E6%9E%84%E9%80%A0%E9%A1%B5%E9%9D%A2) 。

```js
import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
Component({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    /* 绑定配置（见下文） */
  },
});
```

也可以把 `storeBindings` 设置为一个数组，这样可以同时绑定多个 `store` ：

```js
import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
Component({
  behaviors: [storeBindingsBehavior],
  storeBindings: [
    {
      /* 绑定配置 1 */
    },
    {
      /* 绑定配置 2 */
    },
  ],
});
```

### 手工绑定

**手工绑定** 适用于全部场景。做法：使用 `createStoreBindings` 创建绑定，它会返回一个包含清理函数的对象用于取消绑定。

注意：在页面 onUnload （自定义组件 detached ）时一定要调用清理函数，否则将导致内存泄漏！

```js
import { createStoreBindings } from "mobx-miniprogram-bindings";

Page({
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      /* 绑定配置（见下文） */
    });
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },
});
```

### 绑定配置

无论使用哪种绑定方式，都必须提供一个绑定配置对象。这个对象包含的字段如下：

| 字段名  | 类型                 | 含义                         |
| ------- | -------------------- | ---------------------------- |
| store   | 一个 MobX observable | 默认的 MobX store            |
| fields  | 数组或者对象         | 用于指定需要绑定的 data 字段 |
| actions | 数组或者对象         | 用于指定需要映射的 actions   |

#### `fields`

`fields` 有三种形式：

- 数组形式：指定 data 中哪些字段来源于 `store` 。例如 `['numA', 'numB', 'sum']` 。
- 映射形式：指定 data 中哪些字段来源于 `store` 以及它们在 `store` 中对应的名字。例如 `{ a: 'numA', b: 'numB' }` ，此时 `this.data.a === store.numA` `this.data.b === store.numB` 。
- 函数形式：指定 data 中每个字段的计算方法。例如 `{ a: () => store.numA, b: () => anotherStore.numB }` ，此时 `this.data.a === store.numA` `this.data.b === anotherStore.numB` 。

上述三种形式中，映射形式和函数形式可以在一个配置中同时使用。

如果仅使用了函数形式，那么 `store` 字段可以为空，否则 `store` 字段必填。

#### `actions`

`actions` 可以用于将 store 中的一些 actions 放入页面或自定义组件的 this 下，来方便触发一些 actions 。有两种形式：

- 数组形式：例如 `['update']` ，此时 `this.update === store.update` 。
- 映射形式：例如 `{ buttonTap: 'update' }` ，此时 `this.buttonTap === store.update` 。

只要 `actions` 不为空，则 `store` 字段必填。

## 注意事项

### 延迟更新与立刻更新

为了提升性能，在 store 中的字段被更新后，并不会立刻同步更新到 `this.data` 上，而是等到下个 `wx.nextTick` 调用时才更新。（这样可以显著减少 setData 的调用次数。）

如果需要立刻更新，可以调用：

- `this.updateStoreBindings()` （在 **behavior 绑定** 中）
- `this.storeBindings.updateStoreBindings()` （在 **手工绑定** 中）

### 与 miniprogram-computed 一起使用

与 [miniprogram-computed](https://github.com/wechat-miniprogram/computed) 时，在 behaviors 列表中 `computedBehavior` 必须在后面：

```js
Component({
  behaviors: [storeBindingsBehavior, computedBehavior],
  /* ... */
});
```

### 关于部分更新

如果只是更新对象中的一部分（子字段），是不会引发界面变化的！例如：

```js
Component({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: ["someObject"],
  },
});
```

如果尝试在 `store` 中：

```js
this.someObject.someField = "xxx";
```

这样是不会触发界面更新的。请考虑改成：

```js
this.someObject = Object.assign({}, this.someObject, { someField: "xxx" });
```
