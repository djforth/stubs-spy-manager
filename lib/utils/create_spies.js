'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddSpy = exports.checkObj = undefined;

var _immutable = require('immutable');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var checkObj = exports.checkObj = function checkObj(im) {
  return _immutable.Map.isMap(im) && im.has('keys') && im.get('keys') !== undefined;
};

// const getSpyName = (item)=>{
//   if (item.has('name')) return item.get('name');
//   return item.get('title');
// };

// const getKeys = (item)=>{
//   let keys = item.get('keys');
//   return keys.map((key)=>{
//     if (Map.isMap(key)) return key.get('title');
//     return key;
//   }).toArray();
// };

var CreateMockObj = function CreateMockObj(item) {
  return item.get('keys').reduce(function (obj, key) {
    if (_immutable.Map.isMap(key)) {
      key = key.get('title');
    }
    return Object.assign(obj, _defineProperty({}, key, jest.fn()));
  }, {});
};

var AddSpy = exports.AddSpy = function AddSpy(item) {
  if (!_immutable.Map.isMap(item) || !item.has('title')) return null;

  if (checkObj(item)) {
    return CreateMockObj(item);
  }

  return jest.fn();
};

var AddCallBack = function AddCallBack(get_callback) {
  return function (spy, cb) {
    var _get_callback = get_callback(cb),
        callback = _get_callback.callback,
        returnSpy = _get_callback.returnSpy;

    if (callback === null) return;

    if (_lodash2.default.isFunction(callback) && !returnSpy) {
      spy.mockImplementation(callback);
      return;
    }

    if (_lodash2.default.isArray(callback)) {
      callback.forEach(function (cb, i) {
        var rv = _lodash2.default.isFunction(cb) ? cb : function () {
          return cb;
        };
        if (i < callback.length - 1) {
          spy.mockImplementationOnce(rv);
          return;
        }
        spy.mockImplementation(rv);
      });
      // spy.and.returnValues.apply(this, callback);
      return;
    }

    spy.mockImplementation(function () {
      return callback;
    });
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
      var spyObj = item.get('spy');
      item.get('keys').forEach(function (key) {
        if (_immutable.Map.isMap(key) && key.has('callback')) {
          var spy = spyObj[key.get('title')];
          add_callback(spy, key.get('callback'));
        }
      });
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