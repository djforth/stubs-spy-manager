'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResetSpy = exports.ClearSpy = undefined;

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _has2 = require('lodash/has');

var _has3 = _interopRequireDefault(_has2);

var _isPlainObject2 = require('lodash/isPlainObject');

var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

var _create_spies = require('./create_spies');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkSpy = function checkSpy(im) {
  return im.has('spy') && (0, _isPlainObject3.default)(im.get('spy'));
};

// export default ()=>'for testing';

var ClearSpy = exports.ClearSpy = function ClearSpy(item) {
  if ((0, _create_spies.checkObj)(item) && checkSpy(item)) {
    var spy = item.get('spy');
    var keys = Object.keys(spy);
    keys.forEach(function (key) {
      spy[key].mockClear();
    });
  } else {
    item.get('spy').mockClear();
  }
};

var mockReset = function mockReset(spy) {
  if (spy && (0, _has3.default)(spy, 'mockReset') && (0, _isFunction3.default)(spy.mockReset)) spy.mockReset();
};

var ResetSpy = exports.ResetSpy = function ResetSpy(item) {
  if ((0, _create_spies.checkObj)(item) && checkSpy(item)) {
    var spy = item.get('spy');
    var keys = Object.keys(spy);
    keys.forEach(function (key) {
      mockReset(spy[key]);
    });
  } else {
    mockReset(item.get('spy'));
  }
};