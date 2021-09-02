import { configure, observable, action } from "mobx-miniprogram";

configure({ enforceActions: "observed" });
export const store = observable({
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
