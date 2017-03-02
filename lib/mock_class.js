'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _isString2 = require('lodash/isString');

var _isString3 = _interopRequireDefault(_isString2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addMethods(ClassConst, methods) {
  return (0, _map3.default)(methods, function (m) {
    var title = (0, _isString3.default)(m) ? m : m.title;
    var spy = jasmine.createSpy(title);
    ClassConst.prototype[title] = spy;
    return { title: title, spy: spy };
  });
}

exports.default = function (title, methods) {
  var init = jasmine.createSpy('init');
  var spies = [{ title: 'init', spy: init }];
  var ConstClass = function ConstClass() {
    init.apply(undefined, arguments);
  };

  if ((0, _isArray3.default)(methods) && !(0, _isEmpty3.default)(methods)) {
    spies = spies.concat(addMethods(ConstClass, methods));
  }

  return {
    getMock: function getMock() {
      return ConstClass;
    },
    getConstSpy: function getConstSpy() {
      var obj = (0, _find3.default)(spies, function (spy) {
        return spy.title === 'init';
      });
      return obj.spy;
    },
    getSpy: function getSpy(spy_name) {
      var obj = (0, _find3.default)(spies, function (spy) {
        return spy.title === spy_name;
      });
      return obj.spy;
    }
  };
};

module.exports = exports['default'];