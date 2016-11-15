# Stubs-spy-manager

A module to help manage creating spies and stubs in jasmine utilising babel-plugin-rewire

Install:

```bash
npm i --save-dev @djforth/stubs-spy-manager
```

## Set up

```javascript
import SpyManager from '@djforth/stubs-spy-manager';
import MyModule from './path/to/my_module';

let spies_stubs = SpyManager(MyModule);
```

### Adding spies:

```javascript
spies_stubs([
  // Add foo spy with returnValue foo
  {
    spy: 'Foo'
    callback: 'foo'
  }
  // Add bar spy with callFake
  ,  {
    spy: 'Bar'
    callback: ()=>'foo'
  }
  // Add FooBar spy with return Spy
  ,  {
    spy: 'FooBar'
    returnSpy: 'foobar_return'
  }
  , {
    spy: 'foobar_return'
    callback: 'foobar_return'
  }
   // Add FooBarObj spy foo & bar methods
  ,  {
    spy: 'FooBarObj.foo'
    callback: 'foo'
  }
  , {
    spy: 'FooBarObj.bar'
    callback: 'bar'
  }
])

```

### Adding stubs:

```javascript
spies_stubs([
  // Add foo stub with returnValue foo
  {
    stub: 'Foo'
    callback: 'foo'
  }
  // Add bar stub with callFake
  ,  {
    stub: 'Bar'
    callback: ()=>'foo'
  }
  // Add FooBar stub with return Spy
  ,  {
    stub: 'FooBar'
    spy: 'foobar_return'
  }
  , {
    spy: 'foobar_return'
    callback: 'foobar_return'
  }
   // Add FooBarObj stub foo & bar methods
  ,  {
    stub: 'FooBarObj.foo'
    callback: 'foo'
  }
  , {
    stub: 'FooBarObj.bar'
    callback: 'bar'
  }
])

```

## Make stubs & Spies

So you can add spies and stubs anywhere in your tests then you must call make before you test:

```javascript

  describe('Create Spy', function() {
      let spy;
      beforeEach(()=>{
        spies_stubs.add([
          {
            spy: 'new_spy'
            , callback: 'foo'
          }
        ]);
        spies_stubs.make();
        spy = spies_stubs.get('new_spy');
        rv = spy();
      });

      it('should return foo', function() {
        expect(rv).toEqual('foo');
      });

      it('should call spy', function() {
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('Create Spy Object', function() {
      let spy;
      beforeEach(()=>{
        spies_stubs.add([
          {
            spy: 'new_spy_obj.foo'
            , callback: 'foo'
          }
          , {
            spy: 'new_spy_obj.bar'
            , callback: 'bar'
          }
        ]);
        spies_stubs.make();
        spy = spies_stubs.get('new_spy_obj');
      });

      it('should return foo if foo called', function() {
        rv = spy.foo();
        expect(rv).toEqual('foo');
        expect(spies_stubs.get('new_spy_obj.foo')).toHaveBeenCalled();
      });

      it('should return bar if bar called', function() {
        rv = spy.bar();
        expect(rv).toEqual('bar');
        expect(spies_stubs.get('new_spy_obj.bar')).toHaveBeenCalled();
      });
    });

```

# Bug reports

If you discover any bugs, feel free to create an issue on GitHub. Please add as much information as possible to help us fixing the possible bug. We also encourage you to help even more by forking and sending us a pull request.

https://github.com/djforth/stubs-spy-manager/issues

## Contribute

If you'd like to contribute, morse-jasmine is written using babel in ES6.

Please make sure any additional code should be covered in tests (Jasmine using karma).

If you need to run the test please use:

``` bash

npm test

```

or to rebuild the JS run:

``` bash

npm run build

```

## Maintainers

Adrian Stainforth (https://github.com/djforth)

# License

morse-jasmine is an open source project falling under the MIT License. By using, distributing, or contributing to this project, you accept and agree that all code within the morse-jasmine project are licensed under MIT license.