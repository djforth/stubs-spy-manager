'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isPlainObject2 = require('lodash/isPlainObject');

var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _immutable = require('immutable');

var _title_keys = require('./title_keys');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FindSpies = function FindSpies(list, title, stub) {
  var name = stub ? title + '-stub' : title + '-spy';
  var filtered = list.filter(function (item) {
    return item.get('title') === title && item.has('spy');
  });

  if (filtered.size === 0) return null;
  if (filtered.size === 1) return filtered.first();
  return filtered.find(function (item) {
    return item.get('name') === name;
  });
};

var getTitleAndKey = function getTitleAndKey(t) {
  t = (0, _title_keys.Splitter)(t);
  if ((0, _isArray3.default)(t)) {
    var _t = t,
        _t2 = _slicedToArray(_t, 2),
        title = _t2[0],
        key = _t2[1];

    return { title: title, key: key };
  }
  if (typeof t === 'string') return { title: t };
  if ((0, _isPlainObject3.default)(t) && t.hasOwnProperty('title')) return t;

  return null;
};

exports.default = function (list, title) {
  var stub = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!_immutable.List.isList(list) || list.size === 0) return null;
  var tk = getTitleAndKey(title);

  if (tk === null) return tk;
  var spyMap = FindSpies(list, tk.title, stub);
  if (!_immutable.Map.isMap(spyMap) || !spyMap.has('spy')) return null;

  var spy = spyMap.get('spy');

  if (tk.hasOwnProperty('key')) return spy[tk.key];
  return spy;
};

module.exports = exports['default'];