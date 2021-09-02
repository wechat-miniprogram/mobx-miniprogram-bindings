import { testBehavior } from "./behavior";
Page({
  behaviors: [testBehavior],
  data: {
    someData: "...",
  },
  onLoad: function () {

  },
  onShow() {
    console.log(this.data)
  },
  showdata() {
    console.log(this.data)
  }
});
