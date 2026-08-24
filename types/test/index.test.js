"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const adapter = __importStar(require("glass-easel-miniprogram-adapter"));
const mobx_miniprogram_1 = require("mobx-miniprogram");
const miniprogram_computed_1 = require("miniprogram-computed");
const src_1 = require("../src");
const env_1 = require("./env");
(0, mobx_miniprogram_1.configure)({ enforceActions: 'observed' });
const innerHTML = (component) => {
    return component._$.$$.innerHTML;
};
test('manually creation', async () => {
    const store = (0, mobx_miniprogram_1.makeAutoObservable)({
        numA: 1,
        numB: 2,
        get sum() {
            return this.numA + this.numB;
        },
        update: function () {
            const sum = this.sum;
            this.numA = this.numB;
            this.numB = sum;
        },
    });
    const component = (0, env_1.renderComponent)(undefined, '<view>{{a}}+{{b}}={{c}}</view>', (Component) => {
        Component({
            attached() {
                this.storeBindings = (0, src_1.createStoreBindings)(this, {
                    store,
                    fields: {
                        a: 'numA',
                        b: 'numB',
                        c: 'sum',
                    },
                    actions: ['update'],
                });
            },
            detached() {
                this.storeBindings.destroyStoreBindings();
            },
        });
    });
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<view>1+2=3</view>');
    component.update();
    component.storeBindings.updateStoreBindings();
    expect(innerHTML(component)).toBe('<view>2+3=5</view>');
});
test('declarative creation', async () => {
    const store = (0, mobx_miniprogram_1.makeAutoObservable)({
        numA: 1,
        numB: 2,
        get sum() {
            return this.numA + this.numB;
        },
        update: function () {
            const sum = this.sum;
            this.numA = this.numB;
            this.numB = sum;
        },
    });
    const component = (0, env_1.renderComponent)(undefined, '<view>{{numA}}+{{numB}}={{sum}}</view>', (Component) => {
        Component({
            behaviors: [src_1.storeBindingsBehavior],
            storeBindings: {
                store,
                fields: ['numA', 'numB', 'sum'],
                actions: { up: 'update' },
            },
        });
    });
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<view>1+2=3</view>');
    component.up();
    component.updateStoreBindings();
    expect(innerHTML(component)).toBe('<view>2+3=5</view>');
});
test('declarative creation with page constructor', async () => {
    const store = (0, mobx_miniprogram_1.makeAutoObservable)({
        numA: 1,
        numB: 2,
        get sum() {
            return this.numA + this.numB;
        },
        update: function () {
            const sum = this.sum;
            this.numA = this.numB;
            this.numB = sum;
        },
    });
    const component = (0, env_1.renderComponent)(undefined, '<view>{{numA}}+{{numB}}={{sum}}</view>', (_Component, env) => {
        env.Page({
            behaviors: [src_1.storeBindingsBehavior],
            storeBindings: {
                store,
                fields: ['numA', 'numB', 'sum'],
                actions: { up: 'update' },
            },
        });
    });
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<view>1+2=3</view>');
    component.up();
    component.updateStoreBindings();
    expect(innerHTML(component)).toBe('<view>2+3=5</view>');
});
test('destroy', async () => {
    const store = (0, mobx_miniprogram_1.makeAutoObservable)({
        numA: 1,
        numB: 2,
        get sum() {
            return this.numA + this.numB;
        },
        update: function () {
            const sum = this.sum;
            this.numA = this.numB;
            this.numB = sum;
        },
    });
    (0, env_1.defineComponent)('custom-comp', '<view>{{numA}}+{{numB}}={{sum}}</view>', (Component) => {
        Component({
            behaviors: [src_1.storeBindingsBehavior],
            storeBindings: {
                store,
                fields: ['numA', 'numB', 'sum'],
                actions: { update: 'update' },
            },
        });
    });
    const component = (0, env_1.renderComponent)(undefined, '<custom-comp />', (Component) => {
        Component({
            attached() {
                this.storeBindings = (0, src_1.createStoreBindings)(this, { store, fields: [], actions: [] });
            },
            detached() {
                this.storeBindings.destroyStoreBindings();
            },
        });
    });
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<custom-comp><view>1+2=3</view></custom-comp>');
    store.update();
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<custom-comp><view>2+3=5</view></custom-comp>');
    adapter.glassEasel.Element.pretendDetached(component._$);
    store.update();
    expect(innerHTML(component)).toBe('<custom-comp><view>2+3=5</view></custom-comp>');
});
test('function-typed fields binding', async () => {
    const store = (0, mobx_miniprogram_1.makeAutoObservable)({
        numA: 1,
        numB: 2,
        get sum() {
            return this.numA + this.numB;
        },
        update: function () {
            const sum = this.sum;
            this.numA = this.numB;
            this.numB = sum;
        },
    });
    const component = (0, env_1.renderComponent)(undefined, '<view>{{a}}+{{b}}={{s}}</view>', (Component) => {
        Component({
            behaviors: [src_1.storeBindingsBehavior],
            storeBindings: {
                fields: {
                    a: () => store.numA,
                    b: () => store.numB,
                    s: () => store.sum,
                },
            },
        });
    });
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<view>1+2=3</view>');
    store.update();
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<view>2+3=5</view>');
});
test('binding multi store in custom components', async () => {
    const storeA = (0, mobx_miniprogram_1.makeAutoObservable)({
        a_A: 1,
        b_A: 2,
        get sum_A() {
            return this.a_A + this.b_A;
        },
        update: function () {
            this.a_A = this.a_A * 10;
            this.b_A = this.b_A * 10;
        },
    });
    const storeB = (0, mobx_miniprogram_1.makeAutoObservable)({
        a_B: 1,
        b_B: 2,
        get sum_B() {
            return this.a_B + this.b_B;
        },
        update: function () {
            this.a_B = this.a_B * 20;
            this.b_B = this.b_B * 20;
        },
    });
    const component = (0, env_1.renderComponent)(undefined, '<view><text>{{a_A}}+{{b_A}}={{sum_A}}</text><text>{{a_B}}+{{b_B}}={{sum_B}}</text></view>', (Component) => {
        Component({
            behaviors: [src_1.storeBindingsBehavior],
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
        });
    });
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<view><text>1+2=3</text><text>1+2=3</text></view>');
    component.updateInStoreA();
    component.updateInStoreB();
    component.updateStoreBindings();
    expect(innerHTML(component)).toBe('<view><text>10+20=30</text><text>20+40=60</text></view>');
});
test('structural comparison', async () => {
    const store = (0, mobx_miniprogram_1.makeAutoObservable)({
        nums: {
            a: 1,
            b: 2,
        },
        update: function () {
            this.nums = {
                a: this.nums.b,
                b: this.nums.a + this.nums.b,
            };
        },
    });
    const component = (0, env_1.renderComponent)(undefined, '<view>{{nums.a}}+{{nums.b}}</view>', (Component) => {
        Component({
            behaviors: [src_1.storeBindingsBehavior],
            storeBindings: {
                structuralComparison: false,
                store,
                fields: ['nums'],
                actions: ['update'],
            },
        });
    });
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<view>1+2</view>');
    store.update();
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<view>2+3</view>');
});
test('cooperate with miniprogram-computed', async () => {
    const store = (0, mobx_miniprogram_1.makeAutoObservable)({
        nums: [1, 2, 3],
        update: function () {
            this.nums = this.nums.concat(this.nums.length + 1);
        },
    });
    const component = (0, env_1.renderComponent)(undefined, '<view>{{sum}}</view>', (Component) => {
        Component({
            behaviors: [src_1.storeBindingsBehavior, miniprogram_computed_1.behavior],
            storeBindings: {
                structuralComparison: false,
                store,
                fields: ['nums'],
                actions: ['update'],
            },
            computed: {
                sum(data) {
                    const nums = data.nums;
                    return nums.reduce((s, o) => s + o, 0);
                },
            },
        });
    });
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<view>6</view>');
    component.update();
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<view>10</view>');
});
test('component with store constructor (array typing)', async () => {
    const store = (0, mobx_miniprogram_1.makeAutoObservable)({
        numA: 1,
        numB: 2,
        get sum() {
            return this.numA + this.numB;
        },
        update: function (times) {
            for (let i = 0; i < times; i += 1) {
                const sum = this.sum;
                this.numA = this.numB;
                this.numB = sum;
            }
        },
    });
    const component = (0, env_1.renderComponent)(undefined, '<view>{{sum}}</view>', (Component) => {
        ;
        globalThis.Component = Component;
        (0, src_1.ComponentWithStore)({
            storeBindings: {
                store,
                fields: ['sum'],
                actions: ['update'],
            },
            created() {
                this.update(1);
            },
        });
        globalThis.Component = undefined;
    });
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<view>5</view>');
    component.update(2);
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<view>13</view>');
});
test('component with store constructor (map typing)', async () => {
    const store = (0, mobx_miniprogram_1.makeAutoObservable)({
        numA: 1,
        numB: 2,
        get sum() {
            return this.numA + this.numB;
        },
        update: function (times) {
            for (let i = 0; i < times; i += 1) {
                const sum = this.sum;
                this.numA = this.numB;
                this.numB = sum;
            }
        },
    });
    const component = (0, env_1.renderComponent)(undefined, '<view>{{s}}</view>', (Component) => {
        ;
        globalThis.Component = Component;
        (0, src_1.ComponentWithStore)({
            storeBindings: {
                store,
                fields: { a: () => store.numA, s: 'sum' },
                actions: { up: 'update' },
            },
            created() {
                this.up(1);
            },
        });
        globalThis.Component = undefined;
    });
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<view>5</view>');
    component.up(2);
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<view>13</view>');
});
test('component with store constructor (multiple stores)', async () => {
    const store1 = (0, mobx_miniprogram_1.makeAutoObservable)({
        numA: 1,
        numB: 2,
        get sum() {
            return this.numA + this.numB;
        },
        update: function (times) {
            for (let i = 0; i < times; i += 1) {
                const sum = this.sum;
                this.numA = this.numB;
                this.numB = sum;
            }
        },
    });
    const store2 = (0, mobx_miniprogram_1.makeAutoObservable)({
        numA: 1,
        numB: 2,
        get sum() {
            return this.numA + this.numB;
        },
        update: function (times) {
            for (let i = 0; i < times; i += 1) {
                const sum = this.sum;
                this.numA = this.numB;
                this.numB = sum;
            }
        },
    });
    const component = (0, env_1.renderComponent)(undefined, '<view>{{sum}}</view><view>{{s}}</view>', (Component) => {
        ;
        globalThis.Component = Component;
        (0, src_1.ComponentWithStore)({
            data: {},
            storeBindings: [
                {
                    store: store1,
                    fields: ['sum'],
                    actions: ['update'],
                },
                {
                    store: store2,
                    fields: { a: () => store2.numA, s: 'sum' },
                    actions: { up: 'update' },
                },
            ],
            created() {
                this.update(1);
                this.up(2);
            },
            attached() {
                expect(this.data.sum).toBe(5);
                expect(this.data.s).toBe(8);
            },
        });
        globalThis.Component = undefined;
    });
    await (0, env_1.waitTick)();
    expect(innerHTML(component)).toBe('<view>5</view><view>8</view>');
});
