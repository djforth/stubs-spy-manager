'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _immutable = require('immutable');

var _compile_spies = require('./utils/compile_spies');

var _compile_spies2 = _interopRequireDefault(_compile_spies);

var _create_spies = require('./utils/create_spies');

var _create_spies2 = _interopRequireDefault(_create_spies);

var _create_stubs = require('./utils/create_stubs');

var _create_stubs2 = _interopRequireDefault(_create_stubs);

var _get_spy = require('./utils/get_spy');

var _get_spy2 = _interopRequireDefault(_get_spy);

var _reset_spies = require('./utils/reset_spies');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lookForStub = function lookForStub(stubber) {
  if (typeof stubber === 'boolean') return stubber;
  if (stubber === 'stub') return true;
  return false;
};

exports.default = function (module) {
  var spies_list = (0, _immutable.List)();
  var create_stubs = (0, _create_stubs2.default)(module);
  var stubs_reset = undefined,
      obj = undefined;
  obj = {
    add: function add(list) {
      spies_list = (0, _compile_spies2.default)(list, spies_list);
      return obj;
    },
    clear: function clear() {
      if ((0, _isFunction3.default)(stubs_reset)) stubs_reset();
      spies_list.forEach(_reset_spies.ClearSpy);
      spies_list = [];
      return obj;
    },
    get: function get(title) {
      var stub = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      return (0, _get_spy2.default)(spies_list, title, lookForStub(stub));
    },
    getFn: function getFn(mod) {
      return module.__GetDependency__(mod);
    },
    getList: function getList() {
      return spies_list;
    },
    make: function make() {
      spies_list = (0, _create_spies2.default)(spies_list);
      var stubs_list = spies_list.filter(function (item) {
        return item.has('stub') && item.get('stub');
      });
      stubs_reset = create_stubs(stubs_list);
      return obj;
    },
    reset: function reset() {
      spies_list.forEach(_reset_spies.ResetSpy);
      return obj;
    }
  };

  return obj;
};

module.exports = exports['default'];