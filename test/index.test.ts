const { configure, observable, action } = require("mobx-miniprogram");
const _ = require("./utils");
const { storeBindingsBehavior, createStoreBindings } = require("../src/index");
const computedBehavior = require("miniprogram-computed").behavior;

// 不允许在动作外部修改状态
configure({ enforceActions: "observed" });

test("manually creation", async () => {
  const store = observable({
    numA: 1,
    numB: 2,
    get sum() {
      return this.numA + this.numB;
    },
    update: action(function () {
      const sum = this.sum;
      this.numA = this.numB;
      this.numB = sum;
    }),
  });

  const componentId = _.load({
    template: "<view>{{a}}+{{b}}={{c}}</view>",
    attached() {
      this.storeBindings = createStoreBindings(this, {
        store,
        fields: {
          a: "numA",
          b: "numB",
          c: "sum",
        },
        actions: ["update"],
      });
    },
    detached() {
      this.storeBindings.destroyStoreBindings();
    },
  });
  const component = _.render(componentId);
  const parent = document.createElement("div");
  component.attach(parent);

  await new Promise((resolve) => {
    wx.nextTick(() => {
      expect(_.match(component.dom, "<wx-view>1+2=3</wx-view>")).toBe(true);

      component.instance.update();
      component.instance.storeBindings.updateStoreBindings();
      expect(_.match(component.dom, "<wx-view>2+3=5</wx-view>")).toBe(true);
      resolve("");
    });
  });
});

test("declarative creation", async () => {
  const store = observable({
    numA: 1,
    numB: 2,
    get sum() {
      return this.numA + this.numB;
    },
    update: action(function () {
      const sum = this.sum;
      this.numA = this.numB;
      this.numB = sum;
    }),
  });

  const componentId = _.load({
    template: "<view>{{numA}}+{{numB}}={{sum}}</view>",
    behaviors: [storeBindingsBehavior],
    storeBindings: {
      store,
      fields: ["numA", "numB", "sum"],
      actions: { up: "update" },
    },
  });
  const component = _.render(componentId);
  const parent = document.createElement("div");
  component.attach(parent);

  await new Promise((resolve) => {
    wx.nextTick(() => {
      expect(_.match(component.dom, "<wx-view>1+2=3</wx-view>")).toBe(true);

      component.instance.up();
      component.instance.updateStoreBindings();
      expect(_.match(component.dom, "<wx-view>2+3=5</wx-view>")).toBe(true);

      resolve("");
    });
  });
});

test("destroy", async () => {
  const store = observable({
    numA: 1,
    numB: 2,
    get sum() {
      return this.numA + this.numB;
    },
    update: action(function () {
      const sum = this.sum;
      this.numA = this.numB;
      this.numB = sum;
    }),
  });

  _.load({
    id: "custom-comp",
    template: "<view>{{numA}}+{{numB}}={{sum}}</view>",
    behaviors: [storeBindingsBehavior],
    storeBindings: {
      store,
      fields: ["numA", "numB", "sum"],
      actions: { update: "update" },
    },
  });
  const componentId = _.load({
    template: "<custom-comp />",
    attached() {
      this.storeBindings = createStoreBindings(this, {});
    },
    detached() {
      this.storeBindings.destroyStoreBindings();
    },
  });
  const component = _.render(componentId);
  const parent = document.createElement("div");
  component.attach(parent);

  await new Promise((resolve) => {
    wx.nextTick(() => {
      expect(
        _.match(
          component.dom,
          "<custom-comp><wx-view>1+2=3</wx-view></custom-comp>"
        )
      ).toBe(true);

      store.update();
      wx.nextTick(() => {
        expect(
          _.match(
            component.dom,
            "<custom-comp><wx-view>2+3=5</wx-view></custom-comp>"
          )
        ).toBe(true);
        const child = component.dom.childNodes[0];
        expect(_.match(child, "<wx-view>2+3=5</wx-view>")).toBe(true);

        component.detach();
        store.update();
        wx.nextTick(() => {
          expect(
            _.match(
              component.dom,
              "<custom-comp><wx-view>2+3=5</wx-view></custom-comp>"
            )
          ).toBe(true);
          expect(_.match(child, "<wx-view>2+3=5</wx-view>")).toBe(true);
          resolve("");
        });
      });
    });
  });
});

test("function-typed fields binding", async () => {
  const store = observable({
    numA: 1,
    numB: 2,
    get sum() {
      return this.numA + this.numB;
    },
    update: action(function () {
      const sum = this.sum;
      this.numA = this.numB;
      this.numB = sum;
    }),
  });

  const componentId = _.load({
    template: "<view>{{a}}+{{b}}={{s}}</view>",
    behaviors: [storeBindingsBehavior],
    storeBindings: {
      fields: {
        a: () => store.numA,
        b: () => store.numB,
        s: () => store.sum,
      },
    },
  });
  const component = _.render(componentId);
  const parent = document.createElement("div");
  component.attach(parent);

  await new Promise((resolve) => {
    wx.nextTick(() => {
      expect(_.match(component.dom, "<wx-view>1+2=3</wx-view>")).toBe(true);

      store.update();
      wx.nextTick(() => {
        expect(_.match(component.dom, "<wx-view>2+3=5</wx-view>")).toBe(true);

        resolve("");
      });
    });
  });
});

test("binding multi store in custom components", async () => {
  const storeA = observable({
    a_A: 1,
    b_A: 2,
    get sum_A() {
      return this.a_A + this.b_A;
    },
    update: action(function () {
      this.a_A = this.a_A * 10;
      this.b_A = this.b_A * 10;
    }),
  });

  const storeB = observable({
    a_B: 1,
    b_B: 2,
    get sum_B() {
      return this.a_B + this.b_B;
    },
    update: action(function () {
      this.a_B = this.a_B * 20;
      this.b_B = this.b_B * 20;
    }),
  });

  const componentAB = _.load({
    template:
      "<view><text>{{a_A}}+{{b_A}}={{sum_A}}</text><text>{{a_B}}+{{b_B}}={{sum_B}}</text></view>",
    behaviors: [storeBindingsBehavior],
    storeBindings: [
      {
        store: storeA,
        fields: ["a_A", "b_A", "sum_A"],
        actions: { updateInStoreA: "update" },
      },
      {
        store: storeB,
        fields: ["a_B", "b_B", "sum_B"],
        actions: { updateInStoreB: "update" },
      },
    ],
  });
  const component = _.render(componentAB);
  const parent = document.createElement("div");
  component.attach(parent);
  await new Promise((resolve) => {
    wx.nextTick(() => {
      expect(
        _.match(
          component.dom,
          "<wx-view><wx-text>1+2=3</wx-text><wx-text>1+2=3</wx-text></wx-view>"
        )
      ).toBe(true);
      component.instance.updateInStoreA();
      component.instance.updateInStoreB();
      component.instance.updateStoreBindings();
      wx.nextTick(() => {
        expect(
          _.match(
            component.dom,
            "<wx-view><wx-text>10+20=30</wx-text><wx-text>20+40=60</wx-text></wx-view>"
          )
        ).toBe(true);
        resolve("");
      });
    });
  });
});

test("structural comparison", async () => {
  const store = observable({
    nums: {
      a: 1,
      b: 2,
    },
    update: action(function () {
      this.nums = {
        a: this.nums.b,
        b: this.nums.a + this.nums.b,
      };
    }),
  });

  const componentId = _.load({
    template: "<view>{{nums.a}}+{{nums.b}}</view>",
    behaviors: [storeBindingsBehavior],
    storeBindings: {
      structuralComparison: false,
      store,
      fields: ["nums"],
      actions: ["update"],
    },
  });
  const component = _.render(componentId);
  const parent = document.createElement("div");
  component.attach(parent);

  await new Promise((resolve) => {
    wx.nextTick(() => {
      expect(_.match(component.dom, "<wx-view>1+2</wx-view>")).toBe(true);

      component.instance.update();
      component.instance.updateStoreBindings();
      expect(_.match(component.dom, "<wx-view>2+3</wx-view>")).toBe(true);

      resolve("");
    });
  });
});

test("cooperate with miniprogram-computed", async () => {
  const store = observable({
    nums: [1, 2, 3],
    update: action(function () {
      this.nums = this.nums.concat(this.nums.length + 1);
    }),
  });
  const componentId = _.load({
    template: "<view>{{sum}}</view>",
    behaviors: [storeBindingsBehavior, computedBehavior],
    storeBindings: {
      structuralComparison: false,
      store,
      fields: ["nums"],
      actions: ["update"],
    },
    computed: {
      sum(data) {
        const nums = data.nums;
        return nums.reduce((s, o) => s + o, 0);
      },
    },
  });
  const component = _.render(componentId);
  const parent = document.createElement("div");
  component.attach(parent);

  await new Promise((resolve) => {
    wx.nextTick(() => {
      expect(_.match(component.dom, "<wx-view>6</wx-view>")).toBe(true);

      component.instance.update();
      component.instance.updateStoreBindings();
      expect(_.match(component.dom, "<wx-view>10</wx-view>")).toBe(true);

      resolve("");
    });
  });
});
