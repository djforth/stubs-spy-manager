'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConstructFromString = exports.ConstructFromObject = exports.ConstructFromArray = exports.Splitter = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Splitter = exports.Splitter = function Splitter(t) {
  if (typeof t === 'string' && t.match(/\./)) {
    return t.split('.');
  }
  return t;
};

var ConstructFromArray = exports.ConstructFromArray = function ConstructFromArray(split) {
  if (_lodash2.default.isArray(split)) {
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
  if (_lodash2.default.isPlainObject(split) && split.hasOwnProperty('title') && split.hasOwnProperty('keys')) {
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