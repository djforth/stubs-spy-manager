'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _merger = require('./merger');

var _merger2 = _interopRequireDefault(_merger);

var _title_keys = require('./title_keys');

var _title_keys2 = _interopRequireDefault(_title_keys);

var _create_callbacks = require('./create_callbacks');

var _create_callbacks2 = _interopRequireDefault(_create_callbacks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTitle = function getTitle(item) {
  if (item.hasOwnProperty('stub')) {
    return {
      title: (0, _title_keys.Splitter)(item.stub),
      stub: true
    };
  }

  return {
    title: (0, _title_keys.Splitter)(item.spy),
    stub: false
  };
};

var CreateItem = function CreateItem(titleAndKeys) {
  return function (item) {
    var prepped = getTitle(item);
    var titlekeys = titleAndKeys(prepped.title);
    if (titlekeys === null) return null;
    prepped = Object.assign(prepped, titlekeys);

    var cb = (0, _create_callbacks2.default)(item);
    if (cb === null) return _immutable2.default.fromJS(prepped);

    if (prepped.hasOwnProperty('keys')) {
      var key = Object.assign({ title: prepped.keys[0] }, cb);
      prepped.keys = [key];
      return _immutable2.default.fromJS(prepped);
    }

    return _immutable2.default.fromJS(Object.assign(prepped, cb));
  };
};

exports.default = function (list) {
  var current = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _immutable.List)();

  var titleKeys = (0, _title_keys2.default)([_title_keys.ConstructFromArray, _title_keys.ConstructFromObject, _title_keys.ConstructFromString]);

  var creator = CreateItem(titleKeys);

  return list.reduce(function (prev, curr) {
    var item = creator(curr);
    if (item === null) return prev;
    return (0, _merger2.default)(prev, item);
  }, current);
};

module.exports = exports['default'];