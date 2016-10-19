'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addSpy(title, ret) {
  var spy = jasmine.createSpy(title);
  // addReturn(spy, ret)
  return { title: title, spy: spy };
}

function _addReturn(spy, ret) {
  if (_lodash2.default.isObject(ret) && ret.function && ret.value) {
    spy.and[ret.function](ret.value);
  }
}

function addSpyObj(title, methods) {
  var keys = _lodash2.default.map(methods, function (m) {
    if (_lodash2.default.isString(m)) return m;
    return m.title;
  });
  var spy = jasmine.createSpyObj(title, keys);

  return { title: title, spy: spy };
}

function addSpytype(title, opts) {
  if (_lodash2.default.isArray(opts)) return addSpyObj(title, opts);

  return addSpy(title, opts);
}

function getItem(list, title) {
  var obj = _lodash2.default.find(list, function (spy) {
    return spy.title === title;
  });
  if (_lodash2.default.isEmpty(obj)) return null;
  return obj;
}

function addSpyArray(spies) {
  return _lodash2.default.map(spies, function (m) {
    var title = _lodash2.default.isString(m) ? m : m.title;
    var opts = _lodash2.default.isString(m) ? null : m.opts;
    return addSpytype(title, opts);
  });
}

function resetSpyObj(obj) {
  _lodash2.default.forIn(obj, function (v, k) {
    v.calls.reset();
  });
}

module.exports = function () {
  var spies = [];

  var obj = {
    add: function add(modules) {
      return obj.addSpy(modules);
    },
    addSpy: function addSpy(modules) {
      if (_lodash2.default.isArray(modules)) {
        spies = spies.concat(addSpyArray(modules));
        return obj;
      }

      if (_lodash2.default.isObject(modules)) {
        var _ref = [modules.title, modules.opts];
        var title = _ref[0];
        var opts = _ref[1];

        spies.push(addSpytype(title, opts));
      }

      if (_lodash2.default.isString(modules)) {
        spies.push(addSpytype(modules, null));
      }

      return obj;
    },
    addReturn: function addReturn(title, spy_obj) {
      var spy = getItem(spies, title);
      if (_lodash2.default.isNull(spy)) {
        var new_spy = spy_obj ? { title: title, opts: [spy_obj] } : title;
        obj.addSpy(new_spy);
        spy = getItem(spies, title);
      }
      spy = spy.spy;
      if (spy_obj) spy = spy[spy_obj];
      return function (type, val) {
        _addReturn(spy, { function: type, value: val });
      };
    },
    returnObj: function returnObj(title) {
      var spy = getItem(spies, title).spy;
      return function (opts) {
        _lodash2.default.forEach(opts, function (opt) {
          spy[opt.title].and[opt.func](opt.value);
        });
      };
    },
    getSpy: function getSpy(title) {
      var obj = getItem(spies, title);
      if (_lodash2.default.isNull(obj)) return null;
      return obj.spy;
    },
    get: function get(title) {
      return obj.getSpy(title);
    },
    removeAll: function removeAll() {
      _lodash2.default.forEach(spies, function (s) {
        if (_lodash2.default.isPlainObject(s.spy)) {
          resetSpyObj(s.spy);
        } else {
          s.spy.calls.reset();
        }
      });
      spies = [];
      return obj;
    },
    removeSpy: function removeSpy(title) {
      spies = _lodash2.default.reject(spies, function (s) {
        if (s.title !== title) return false;
        if (_lodash2.default.isPlainObject(s.spy)) {
          resetSpyObj(s.spy);
        } else {
          s.spy.calls.reset();
        }

        return true;
      });
      return obj;
    }
  };

  return obj;
};