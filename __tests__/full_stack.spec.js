import SpyManager from '../src';
import Immutable, {List} from 'immutable';
import Dummy, {Testing, Testing2, Testing3} from './__dummy__/test';

describe('Full Stack test', function(){
  let spies_stubs = SpyManager(Dummy);
  let rv;
  beforeEach(()=>{
    spies_stubs.add([
      {
        stub: 'test1_fn'
        , callback: 'bar'
      }
    ]);
  });

  afterEach(()=>{
    spies_stubs.reset();
  });

  describe('Create Spy', function(){
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

    it('should return foo', function(){
      expect(rv).toEqual('foo');
    });

    it('should call spy', function(){
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Create Spy Object', function(){
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

    it('should return foo if foo called', function(){
      rv = spy.foo();
      expect(rv).toEqual('foo');
      expect(spies_stubs.get('new_spy_obj.foo')).toHaveBeenCalled();
    });

    it('should return bar if bar called', function(){
      rv = spy.bar();
      expect(rv).toEqual('bar');
      expect(spies_stubs.get('new_spy_obj.bar')).toHaveBeenCalled();
    });
  });

  describe('Create Spy that returns spy', function(){
    let spy;
    beforeEach(()=>{
      spies_stubs.add([
        {
          spy: 'new_spy_return'
          , returnSpy: 'return_spy'
        }
        , {
          spy: 'return_spy'
          , callback: 'foo'
        }
      ]);
      spies_stubs.make();
      spy = spies_stubs.get('new_spy_return');
      rv = spy();
    });

    it('should return \'return_spy\'', function(){
      expect(rv).toEqual(spies_stubs.get('return_spy'));
    });

    it('should call spy', function(){
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('stub method', function(){
    beforeEach(()=>{
      spies_stubs.add([
        {
          stub: 'test_fn'
          , callback: 'foo'
        }
      ]);
      spies_stubs.make();
      rv = Dummy();
    });

    it('should stub the methods', function(){
      expect(rv).toEqual('foobar');
    });

    it('should call stubs', function(){
      let stub1 = spies_stubs.get('test_fn');
      expect(stub1).toHaveBeenCalled();
      let stub2 = spies_stubs.get('test1_fn');
      expect(stub2).toHaveBeenCalled();
    });
  });

  describe('stub method return spy', function(){
    beforeEach(()=>{
      spies_stubs.add([
        {
          stub: 'test2_fn'
          , spy: 'test'
        }
        , {
          spy: 'test'
          , callback: 'foo'
        }
      ]);
      spies_stubs.make();
      rv = Testing()();
    });

    it('should stub the methods', function(){
      expect(rv).toEqual(spies_stubs.get('test'));
    });

    it('should call stubs', function(){
      let stub1 = spies_stubs.get('test2_fn');
      expect(stub1).toHaveBeenCalled();
    });
  });

  describe('Create Stub that returns spy obj', function(){
    let spy;
    beforeEach(()=>{
      spies_stubs.add([
        {
          stub: 'test3_fn.foo'
          , callback: 'foo'
        }
        , {
          stub: 'test3_fn.bar'
          , callback: 'bar'
        }
      ]);
      spies_stubs.make();
      spy = Testing2();
    });

    it('should return foo if foo called', function(){
      rv = spy.foo();
      expect(rv).toEqual('foo');
      expect(spies_stubs.get('test3_fn.foo')).toHaveBeenCalled();
    });

    it('should return bar if bar called', function(){
      rv = spy.bar();
      expect(rv).toEqual('bar');
      expect(spies_stubs.get('test3_fn.bar')).toHaveBeenCalled();
    });
  });

  describe('create spy & stub with same name', function(){
    let spy;
    beforeEach(()=>{
      spies_stubs.add([
        {
          stub: 'test4_fn'
          , callback: 'bar'
        }
        , {
          spy: 'test4_fn'
          , callback: 'foo'
        }
      ]);
      spies_stubs.make();
      rv = Testing3();
    });

    it('should return foo if foo called', function(){
      expect(rv).toEqual('bar');
      expect(spies_stubs.get('test4_fn', true)).toHaveBeenCalled();
    });

    it('should return bar if bar called', function(){
      spy = spies_stubs.get('test4_fn');
      expect(spy()).toEqual('foo');
      expect(spy).toHaveBeenCalled();
    });
  });
});
