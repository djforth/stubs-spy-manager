'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var StubMethod = exports.StubMethod = function StubMethod(Module) {
  return function (title, spy) {
    Module.__Rewire__(title, spy);
  };
};

var ResetStub = exports.ResetStub = function ResetStub(Module) {
  return function (title) {
    Module.__ResetDependency__(title);
  };
};

exports.default = function (module) {
  var creator = StubMethod(module);
  var reset = ResetStub(module);

  return function (list) {
    list.forEach(function (item) {
      var title = item.get('title');
      var spy = item.get('spy');
      creator(title, spy);
    });

    return function () {
      list.forEach(function (item) {
        reset(item.get('title'));
      });
    };
  };
};