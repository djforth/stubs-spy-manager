'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CheckCallBack = exports.CheckCallBack = function CheckCallBack(item) {
  if (item.hasOwnProperty('callback')) return 1;
  if (item.hasOwnProperty('stub')) {
    return item.hasOwnProperty('spy') ? 2 : 0;
  }

  return item.hasOwnProperty('returnSpy') ? 3 : 0;
};

var MakeCallback = exports.MakeCallback = function MakeCallback(item) {
  return { callback: item.callback };
};

var MakeSpyCallback = exports.MakeSpyCallback = function MakeSpyCallback(title) {
  return { callback: { spy: true, title: title } };
};

exports.default = function (item) {
  switch (CheckCallBack(item)) {
    case 1:
      return MakeCallback(item);
    case 2:
      return MakeSpyCallback(item.spy);
    case 3:
      return MakeSpyCallback(item.returnSpy);
    default:
      return null;
  }
};