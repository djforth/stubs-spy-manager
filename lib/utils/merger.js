'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mergeKeys = function mergeKeys(item, newitem) {
  var current = item.get('keys');
  current = _lodash2.default.isUndefined(current) ? (0, _immutable.List)() : current;
  var keys = newitem.get('keys');
  keys = keys.filter(function (key) {
    return !current.includes(key);
  });
  if (keys.size === 0) return item;
  return item.set('keys', current.concat(keys));
};

var checkTitle = function checkTitle(list, newitem) {
  var matched = list.find(function (item) {
    return item.get('title') === newitem.get('title');
  });
  if (!matched) return newitem;
  var prefix = newitem.get('stub') ? '-stub' : '-spy';
  var name = newitem.get('title') + prefix;
  return newitem.set('name', name);
};

exports.default = function (list, newitem) {
  var matched = list.find(function (item) {
    return item.get('title') === newitem.get('title') && item.get('stub') === newitem.get('stub');
  });

  if (matched) {
    if (!newitem.has('keys')) return list;
    var index = list.indexOf(matched);
    return list.set(index, mergeKeys(matched, newitem));
  }

  return list.push(checkTitle(list, newitem));
};

module.exports = exports['default'];