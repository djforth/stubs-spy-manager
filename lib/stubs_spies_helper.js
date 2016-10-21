'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStubsAndSpies = undefined;

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
      var spy = item.spy;
      var returnType = item.returnType;
      var callback = item.callback;
      var returnSpy = item.returnSpy;

      var title = _lodash2.default.isArray(spy) ? spy : [spy];
      if (returnSpy) {
        // spy = createSpy(spy);
        spyManager.addReturn.apply(undefined, title)('returnValue', spyManager.get(returnSpy));
      } else {
        returnType = setReturnType(returnType, callback);
        spyManager.addReturn.apply(undefined, title)(returnType, callback);
      }

      return spyManager.get(title[0]);
    }

    spyManager.add(item);
    return spyManager.get(item);
  };
};

var CreateStub = function CreateStub(stubs, createSpy) {
  return function (item) {
    if (_lodash2.default.has(item, 'callback') || _lodash2.default.has(item, 'spy')) {
      var stub = item.stub;
      var returnType = item.returnType;
      var callback = item.callback;
      var spy = item.spy;

      var title = _lodash2.default.isArray(stub) ? stub : [stub];
      if (spy) {
        spy = createSpy(spy);
        stubs.return.apply(undefined, title)('returnValue', spy);
      } else {
        returnType = setReturnType(returnType, callback);
        stubs.return.apply(undefined, title)(returnType, callback);
      }

      return stubs.get(title[0]);
    }

    stubs.add(item);
    return stubs.get(item);
  };
};

var splitter = function splitter(item) {
  var title = undefined,
      opts = undefined;
  if (item.match(/\./)) {
    var split = item.split('.');
    title = split[0];
    opts = [split[1]];
    return { title: title, opts: opts };
  }

  return { title: item };
};

var matchItem = function matchItem(list, title) {
  var matched = list.filter(function (item) {
    if (_lodash2.default.isString(item)) return item === title;
    if (_lodash2.default.isPlainObject(item)) return item.title === title;

    return false;
  });

  return matched[0];
};

var getIndexOf = function getIndexOf(list, item) {
  if (!_lodash2.default.isArray(list) || _lodash2.default.isUndefined(item)) return -1;
  var titles = list.map(function (l) {
    if (_lodash2.default.isString(l)) return l;
    return l.title;
  });
  var title = _lodash2.default.isString(item) ? item : item.title;
  return titles.indexOf(title);
};

var mergeItem = function mergeItem(list, item, data) {
  var i = getIndexOf(list, item);
  var newList = list.slice();
  if (_lodash2.default.isPlainObject(item)) {
    data.opts = item.opts.concat(data.opts);
  }
  newList[i] = data;
  return newList;
};

var createNewItem = function createNewItem(item) {
  if (_lodash2.default.has(item, 'opts')) return [item];
  return [item.title];
};

var Adder = function Adder(typeManager, type) {
  return function (types) {
    var type_objs = types.reduce(function (prev, curr) {
      if (_lodash2.default.isString(curr)) return prev.concat([curr]);
      var split = splitter(curr[type]);
      var has = matchItem(prev, split.title);
      if (has) {
        return mergeItem(prev, has, split);
      }

      return prev.concat(createNewItem(split));
    }, []);
    typeManager.add(type_objs);
  };
};

exports.default = function (stubs, spyManager) {
  var addSpies = Adder(spyManager, 'spy');
  var addStubs = Adder(stubs, 'stub');
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