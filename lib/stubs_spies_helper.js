'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStubsAndSpies = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createStubsAndSpies = exports.createStubsAndSpies = function createStubsAndSpies(stubs, spyManager) {
  return function (items) {
    stubs.add(items);
    var spyManger = items.map(function (item) {
      return item + 'Something';
    });
    spyManager.add(spyManger);

    items.forEach(function (item) {
      stubs.return(item)('returnValue', spyManager.get(item + 'Something'));
    });
  };
};

var setReturnType = function setReturnType(returnType, callback) {
  if (returnType) return returnType;
  return _lodash2.default.isFunction(callback) ? 'callFake' : 'returnValue';
};

var CreateSpy = function CreateSpy(spyManager) {
  return function (item) {
    if (_lodash2.default.has(item, 'callback') || _lodash2.default.has(item, 'returnSpy')) {
      var _spy = item.spy;
      var returnType = item.returnType;
      var callback = item.callback;
      var returnSpy = item.returnSpy;

      title = _lodash2.default.isArray(_spy) ? _spy : [_spy];
      if (returnSpy) {
        // spy = createSpy(spy);
        spyManager.addReturn.apply(undefined, title)('returnValue', spyManager.get(returnSpy));
      } else {
        returnType = setReturnType(returnType, callback);
        spyManager.addReturn.apply(undefined, title)(returnType, callback);
      }

      return spyManager.get(title[0]);
    }

    spyManager.add(spy);
    return spyManager.get(spy);
  };
};

var CreateStub = function CreateStub(stubs, createSpy) {
  return function (item) {
    if (_lodash2.default.has(item, 'callback') || _lodash2.default.has(item, 'spy')) {
      var _stub = item.stub;
      var returnType = item.returnType;
      var callback = item.callback;
      var _spy2 = item.spy;

      title = _lodash2.default.isArray(_stub) ? _stub : [_stub];
      if (_spy2) {
        _spy2 = createSpy(_spy2);
        stubs.return.apply(undefined, title)('returnValue', _spy2);
      } else {
        returnType = setReturnType(returnType, callback);
        stubs.return.apply(undefined, title)(returnType, callback);
      }

      return stubs.get(title[0]);
    }

    stubs.add(stub);
    return stubs.get(stub);
  };
};

var Adder = function Adder(typeManager) {
  return function (types) {
    var type_objs = types.reduce(function (prev, curr) {
      if (_lodash2.default.isString(curr)) return prev.concat([curr]);

      var _curr = _slicedToArray(curr, 2);

      var title = _curr[0];
      var opts = _curr[1];

      var has = _lodash2.default.find(prev, function (p) {
        return _lodash2.default.isPlainObject(p) && p.title === title;
      });
      if (has) {
        return prev.map(function (pr) {
          if (pr.title !== title) {
            return pr;
          }

          pr.opts = pr.opts.concat([opts]);
          return pr;
        });
      }

      return prev.concat([{
        title: title,
        opts: [opts]
      }]);
    }, []);
    // console.log(type_objs)
    typeManager.add(type_objs);
  };
};

exports.default = function (stubs, spyManager) {
  var addSpies = Adder(spyManager);
  var addStubs = Adder(stubs);
  var createSpy = CreateSpy(spyManager);
  var createStub = CreateStub(stubs, createSpy);

  return function (list) {
    var spies = list.filter(function (item) {
      return _lodash2.default.has(item, 'spy') && !_lodash2.default.has(item, 'stub');
    });
    var stubs_list = list.filter(function (item) {
      return _lodash2.default.has(item, 'stub');
    });
    addSpies(spies);
    addStubs(stubs_list);

    list.forEach(function (item) {
      if (_lodash2.default.has(item, 'stub')) {
        createStub(item);
      } else if (_lodash2.default.has(item, 'spy')) {
        createSpy(item);
      }
    });
  };
};