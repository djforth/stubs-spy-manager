'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stub_inner = require('./stub_inner');

var _stub_inner2 = _interopRequireDefault(_stub_inner);

var _spy_manager = require('./spy_manager');

var _spy_manager2 = _interopRequireDefault(_spy_manager);

var _stubs_spies_helper = require('./stubs_spies_helper');

var _stubs_spies_helper2 = _interopRequireDefault(_stubs_spies_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (module) {
  var spyManager = (0, _spy_manager2.default)();
  var stubsManager = (0, _stub_inner2.default)(module);
  var stubs_spies = (0, _stubs_spies_helper2.default)(stubsManager, spyManager);

  return {
    add: function add(list) {
      stubs_spies(list);
    },
    getSpy: function getSpy(title) {
      return spyManager.get(title);
    },
    getStub: function getStub(title) {
      return stubsManager.get(title);
    },
    get: function get(type, title) {
      if (type === 'stub') return stubsManager.get(title);
      return spyManager.get(title);
    },
    getSpyManager: function getSpyManager() {
      return spyManager;
    },
    getStubManager: function getStubManager() {
      return stubsManager;
    },
    reset: function reset() {
      afterEach(function () {
        spyManager.removeAll();
        stubsManager.revertAll(); // Reverts All stubs
      });
    }
  };
};

module.exports = exports['default'];