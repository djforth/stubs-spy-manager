'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addMethods(ClassConst, methods) {
  return _lodash2.default.map(methods, function (m) {
    var title = _lodash2.default.isString(m) ? m : m.title;
    var spy = jasmine.createSpy(title);
    // if (m.value && m.type) withReturn(spy, m.type, m.value);
    ClassConst.prototype[title] = spy;
    return { title: title, spy: spy };
  });
}

exports.default = function (title, methods) {
  var init = jasmine.createSpy('init');
  var spies = [{ title: 'init', spy: init }];
  var ConstClass = function ConstClass() {
    init.apply(this, arguments);
  };

  if (_lodash2.default.isArray(methods) && !_lodash2.default.isEmpty(methods)) {
    spies = spies.concat(addMethods(ConstClass, methods));
  }

  return {
    getMock: function getMock() {
      return ConstClass;
    },
    getConstSpy: function getConstSpy() {
      var obj = _lodash2.default.find(spies, function (spy) {
        return spy.title === 'init';
      });
      return obj.spy;
    },
    getSpy: function getSpy(spy_name) {
      var obj = _lodash2.default.find(spies, function (spy) {
        return spy.title === spy_name;
      });
      return obj.spy;
    }
  };
};