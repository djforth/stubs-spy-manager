## Get Module

Utility with rewire to get modules/functions in module

```javascript
 var myModule  = require("path/to/my/module")
 var getMod    = require("@djforth/stubs-spy-manager/lib/get_module")(myModule)
 let anotherMod;
 beforeEach(()=>{
  anotherMod = getMod("anotherMod");
 })


```

## Mock Class/Constructor

If your using classes or prototypes allows you to mock or stub the class

Mock

```javascript


var mockClass = require("@djforth/stubs-spy-manager/lib/mock_class")
let myClass, mock;
beforeEach(()=>{
  //Sets up mock
  mock = mockClass("myClass", ["foo", "bar"])
  myClass = mock.getMock();
  // Probably what you'd do:
  // revert = MyMod.__set__("myClass", myClass)
  var class = new myClass()
})

it("should be called", ()=>{
  expect(mock.getConstSpy()).toHaveBeenCalled()
  class.foo("bar")
  expect(mock.getSpy("foo")).toHaveBeenCalledWith("bar")
})

```

## Spy Manager

Allows you create, manage and get spies

```javascript
var spyManager = require("@djforth/stubs-spy-manager/lib/spy_manager")();

beforeEach(()=>{
  spyManager.addSpy(["mySpy", "anotherSpy"]);
  spyManager.addSpy("moreSpy");

  spyManager.addReturn("moreSpy")("returnValue", "some value");
})

afterEach(function () {
  spyManager.removeAll();
});

it("should be called", ()=>{

  expect(spyManager.getSpy("mySpy")).toHaveBeenCalled();
})
```

## Stub chained methods

A utility for stubbing chained methods

```javascript
var stub_chain = require("@djforth/stubs-spy-manager/lib/stub_chain_methods")

beforeEach(()=>{
  stub_chain.addConstructor("main", ["method1", "method2"])
  stub_chain.getConstructor("main")
    .method1()
    .method2();
})

afterEach(()=>{
  stub_chain.removeAll(); //Clear spies
})

it("should be called", ()=>{
  expect(stub_chain.getSpy("main")).toHaveBeenCalled();
  expect(stub_chain.getMethod("main", "method1")).toHaveBeenCalled
  expect(stub_chain.getMethod("main", "method2")).toHaveBeenCalled();
})
```

##Stub inner modules

Stubs out inner modules with spies

```javascript
 var myModule = require("path/to/my/module")
 var stubs = require("@djforth/stubs-spy-manager/lib/stub_cinner")(myModule);

 beforeEach(()=>{
  stubs.addSpy(["another_module", "some_module"]);
})

afterEach(()=>{
  stubs.revertAll(); //Reverts All stubs
})

it("should be called", ()=>{
  expect(stubs.getSpy("another_module")).toHaveBeenCalled();

})

```