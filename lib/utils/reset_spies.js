'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isPlainObject2 = require('lodash/isPlainObject');

var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

var _create_spies = require('./create_spies');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkSpy = function checkSpy(im) {
  return im.has('spy') && (0, _isPlainObject3.default)(im.get('spy'));
};

// const getKeys = (item)=>{
//   let keys = item.get('keys');
//   return keys.map((key)=>{
//     if (Map.isMap(key)) return key.get('title');
//     return key;
//   }).toArray();
// };

exports.default = function (item) {
  if ((0, _create_spies.checkObj)(item) && checkSpy(item)) {
    var spy = item.get('spy');
    var keys = Object.keys(spy);
    keys.forEach(function (key) {
      spy[key].mockReset();
    });
  } else {
    item.get('spy').mockReset();
  }
};

module.exports = exports['default'];