import { observable, action } from "mobx-miniprogram";

export const global = observable({
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
