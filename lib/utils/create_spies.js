'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddSpy = exports.getKeys = exports.checkObj = undefined;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkObj = exports.checkObj = function checkObj(im) {
  return _immutable.Map.isMap(im) && im.has('keys') && im.get('keys') !== undefined;
};

var getSpyName = function getSpyName(item) {
  if (item.has('name')) return item.get('name');
  return item.get('title');
};

var getKeys = exports.getKeys = function getKeys(item) {
  var keys = item.get('keys');
  return keys.map(function (key) {
    if (_immutable.Map.isMap(key)) return key.get('title');
    return key;
  }).toArray();
};

var AddSpy = exports.AddSpy = function AddSpy(item) {
  if (!_immutable.Map.isMap(item) || !item.has('title')) return null;

  var title = getSpyName(item);
  if (checkObj(item)) {
    return jasmine.createSpyObj(title, getKeys(item));
  }

  return jasmine.createSpy(title);
};

var AddCallBack = function AddCallBack(get_callback) {
  return function (spy, cb) {
    var _get_callback = get_callback(cb);

    var callback = _get_callback.callback;
    var returnSpy = _get_callback.returnSpy;

    if (callback === null) return;

    if (_lodash2.default.isFunction(callback) && !returnSpy) {
      spy.and.callFake(callback);
      return;
    }
    if (_lodash2.default.isArray(callback)) {
      spy.and.returnValues.apply(undefined, callback);
      return;
    }

    spy.and.returnValue(callback);
  };
};

var GetCallBack = function GetCallBack(list) {
  return function (cb) {
    if (!_immutable.Map.isMap(cb) || !cb.has('spy')) return { callback: cb, returnSpy: false };
    var item = list.find(function (item) {
      return item.get('title') === cb.get('title');
    });
    if (!item) return null;
    return { callback: item.get('spy'), returnSpy: true };
  };
};

var CreateCallBack = function CreateCallBack(add_callback) {
  return function (item) {
    if (!item.has('spy')) return;

    if (item.has('callback')) {
      add_callback(item.get('spy'), item.get('callback'));
    }

    if (item.has('keys')) {
      (function () {
        var spyObj = item.get('spy');
        item.get('keys').forEach(function (key) {
          if (_immutable.Map.isMap(cb) && key.has('callback')) {
            var spy = spyObj[key.get('title')];
            add_callback(spy, key.get('callback'));
          }
        });
      })();
    }
  };
};

exports.default = function (list) {
  var new_list = list.map(function (item) {
    var spy = AddSpy(item);
    return item.set('spy', spy);
  });

  var get_callback = GetCallBack(new_list);
  var add_callback = AddCallBack(get_callback);
  var create_callback = CreateCallBack(add_callback);
  new_list.forEach(create_callback);

  return new_list;
};