import { configure, observable, action } from "mobx-miniprogram";

export const user = observable({
  numA: 1000,
  numB: 1000,

  get sum() {
    return this.numA + this.numB;
  },

  update_user: action(function () {
    const sum = this.sum;
    this.numA = this.numB;
    this.numB = sum;
  }),
});
