'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _ = require('lodash');

// function createStubsAndSpies(stubs, spyManager){
//   return function(items){
//     stubs.add(items);
//     var spyManger = items.map((item)=>`${item}Something`);
//     spyManager.add(spyManger);

//     items.forEach((item)=>{
//       stubs.return(item)('returnValue', spyManager.get(`${item}Something`));
//     });
//   };
// }

function CreateSpy(spyManager) {
  return function (spy) {
    if (_.has(spy, 'callback')) {
      var title = spy.title;
      var returnType = spy.returnType;
      var callback = spy.callback;

      spyManager.addReturn(title)(returnType || 'returnValue', callback);
      return spyManager.get(title);
    }

    spyManager.add(spy);
    return spyManager.get(spy);
  };
}

function CreateStub(stubs, createSpy) {
  return function (stub) {
    if (_.has(stub, 'callback') || _.has(stub, 'spy')) {
      var title = stub.title;
      var returnType = stub.returnType;
      var callback = stub.callback;
      var spy = stub.spy;

      title = _.isArray(title) ? title : [title];
      if (spy) {
        spy = createSpy(spy);
        stubs.return.apply(this, title)('returnValue', spy);
      } else {
        stubs.return.apply(this, title)(returnType || 'returnValue', callback);
      }

      return stubs.get(title);
    }

    stubs.add(stub);
    return stubs.get(stub);
  };
}

exports.default = function (stubs, spyManager) {
  var createSpy = CreateSpy(spyManager);
  var createStub = CreateStub(stubs, createSpy);
  return function (list) {
    list.forEach(function (item) {
      if (_.has(item, 'stub')) {
        createStub(item.stub);
      } else if (_.has(item, 'spy')) {
        createSpy(item.spy);
      }
    });
  };
};

module.exports = exports['default'];