'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _ = require('lodash');

var spyManager = require('./spy_manager')();

function buildConstructor(construct, methods) {
  spyManager.addSpy(construct);
  spyManager.addSpy(methods);
  var obj = {};
  var spies = _.map(methods, function (m) {
    var spy = spyManager.getSpy(m);

    obj[m] = function () {
      spy.apply(this, arguments);
      return obj;
    };
    return { title: m, spy: spy };
  });

  var con = function con() {
    spyManager.getSpy(construct).apply(this, arguments);

    return obj;
  };

  return {
    title: construct,
    fn: con,
    spy: spyManager.getSpy(construct),
    spies: spies
  };
}

function find(spies, title) {
  return _.find(spies, function (spy) {
    return spy.title === title;
  });
}

var StubChain = function StubChain() {
  var spies = [];

  var obj = {
    addConstructor: function addConstructor(construct, methods) {
      spies.push(buildConstructor(construct, methods));
      return obj;
    },
    getConstructor: function getConstructor(construct) {
      var mock = find(spies, construct);
      if (_.isUndefined(mock)) return;
      return mock.fn;
    },
    getSpy: function getSpy(construct) {
      var spy = find(spies, construct);
      if (_.isUndefined(spy)) return;
      return spy.spy;
    },
    getMethod: function getMethod(construct, method) {
      var methods = find(spies, construct);
      if (_.isUndefined(methods)) return;
      methods = methods.spies;
      var spy = find(methods, method);
      if (_.isUndefined(spy)) return;
      return spy.spy;
    },
    removeAll: function removeAll() {
      spies = [];
    }
  };

  return obj;
};

exports.default = StubChain();
module.exports = exports['default'];