'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _create_spies = require('./create_spies');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkSpy = function checkSpy(im) {
  return im.has('spy') && _lodash2.default.isPlainObject(im.get('spy'));
};

exports.default = function (item) {
  if ((0, _create_spies.checkObj)(item) && checkSpy(item)) {
    (function () {
      var spy = item.get('spy');
      var keys = (0, _create_spies.getKeys)(item);
      keys.forEach(function (key) {
        spy[key].calls.reset();
      });
    })();
  } else {
    item.get('spy').calls.reset();
  }
};

module.exports = exports['default'];