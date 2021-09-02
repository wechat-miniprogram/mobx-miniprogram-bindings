const simulate = require("miniprogram-simulate");

module.exports = simulate;
// a similar nextTick impl
// @ts-ignore
global.wx.nextTick = function (func) {
  setTimeout(func, 16);
};
