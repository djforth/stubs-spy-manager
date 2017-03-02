'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConstructFromString = exports.ConstructFromObject = exports.ConstructFromArray = exports.Splitter = undefined;

var _isPlainObject2 = require('lodash/isPlainObject');

var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Splitter = exports.Splitter = function Splitter(t) {
  if (typeof t === 'string' && t.match(/\./)) {
    return t.split('.');
  }
  return t;
};

var ConstructFromArray = exports.ConstructFromArray = function ConstructFromArray(split) {
  if ((0, _isArray3.default)(split)) {
    if (split.length === 1) {
      return { title: split[0] };
    }

    return {
      title: split[0],
      keys: split.slice(1, split.length)
    };
  }

  return null;
};

var ConstructFromObject = exports.ConstructFromObject = function ConstructFromObject(split) {
  if ((0, _isPlainObject3.default)(split) && split.hasOwnProperty('title') && split.hasOwnProperty('keys')) {
    return split;
  }

  return null;
};

var ConstructFromString = exports.ConstructFromString = function ConstructFromString(split) {
  if (typeof split === 'string') {
    return { title: split };
  }

  return null;
};

exports.default = function (checks) {
  return function (split) {
    return checks.reduce(function (value, check) {
      if (value !== null) return value;
      return check(split);
    }, null);
  };
};