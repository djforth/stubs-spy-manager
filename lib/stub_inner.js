"use strict";

var _ = require("lodash");

var spyManager = require("./spy_manager")();

function getItem(list, title) {
  var obj = _.find(list, function (spy) {
    return spy.title === title;
  });
  if (_.isEmpty(obj)) return null;
  return obj;
}

function spyCreator(Module, manager) {
  return function (mod) {
    var title = _.isString(mod) ? mod : mod.title;
    var spy = manager.addSpy(mod).getSpy(title);
    var revert = Module.__set__(title, spy);
    return { revert: revert, title: title, spy: spy };
  };
}

function resetSpy(spy) {
  if (_.isPlainObject(spy)) {
    _.forIn(spy, function (v, k) {
      v.calls.reset();
    });
  } else {
    spy.calls.reset();
  }
}

module.exports = function (Module) {
  var spies = [];
  var _addSpy = spyCreator(Module, spyManager);
  var obj = {
    add: function add(modules) {
      return obj.addSpy(modules);
    },
    addSpy: function addSpy(modules) {
      if (_.isArray(modules)) {
        modules = _.map(modules, function (m) {
          return _addSpy(m);
        });

        spies = spies.concat(modules);
        return obj;
      }

      if (_.isString(modules) || _.isObject(modules)) {
        spies.push(_addSpy(modules));
      }

      return obj;
    },
    get: function get(title) {
      return obj.getSpy(title);
    },
    getSpy: function getSpy(title) {
      var obj = getItem(spies, title);
      if (_.isNull(obj)) return null;
      return obj.spy;
    },
    return: function _return(title, mod_obj) {
      var mod = getItem(spies, title);
      if (_.isNull(mod)) {
        var new_spy = mod_obj ? { title: title, opts: [mod_obj] } : title;
        obj.addSpy(new_spy);
        mod = getItem(spies, title);
      }

      mod = mod.spy;
      if (mod_obj) mod = mod[mod_obj];
      return function (func, value) {
        mod.and[func](value);
      };
    },
    returnObj: function returnObj(title) {
      var mod = getItem(spies, title).spy;
      return function (opts) {
        _.forEach(opts, function (opt) {
          mod[opt.title].and[opt.func](opt.value);
        });
      };
    },
    revertAll: function revertAll() {
      _.forEach(spies, function (mod) {
        resetSpy(mod.spy);
        mod.revert();
        // Module.__ResetDependency__(mod.title);
      });
      spies = [];
    },
    revertSpy: function revertSpy(title) {
      var mod = getItem(spies, title);
      resetSpy(mod.spy);
      mod.revert();
      // Module.__ResetDependency__(mod.title);
      spies = _.reject(spies, function (s) {
        return s.title === title;
      });
      return mod;
    },
    setSpies: function setSpies(spy_list) {
      _.forEach(spy_list, function (sl) {
        var mod = getItem(spies, sl.title);
        mod.spy.and[sl.func](sl.value);
      });
    }
  };

  return obj;
};