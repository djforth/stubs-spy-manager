'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isUndefined2 = require('lodash/isUndefined');

var _isUndefined3 = _interopRequireDefault(_isUndefined2);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mergeKeys = function mergeKeys(item, newitem) {
  var current = item.get('keys');
  current = (0, _isUndefined3.default)(current) ? (0, _immutable.List)() : current;
  var keys = newitem.get('keys');
  keys = keys.filter(function (key) {
    return !current.includes(key);
  });
  if (keys.size === 0) return item;
  return item.set('keys', current.concat(keys));
};

var makeName = function makeName(item) {
  var prefix = item.get('stub') ? '-stub' : '-spy';
  var name = item.get('title') + prefix;
  return item.set('name', name);
};

var checkTitle = function checkTitle(list, newitem) {
  var matched = list.find(function (item) {
    return item.get('title') === newitem.get('title');
  });
  if (!matched) return list.push(newitem);
  newitem = makeName(newitem);
  list = list.set(list.indexOf(matched), makeName(matched));
  return list.push(newitem);
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

  return checkTitle(list, newitem);
};

module.exports = exports['default'];