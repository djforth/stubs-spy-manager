import SpyManager from '../src';
import _ from 'lodash';
import Immutable, {List} from 'immutable';
import Dummy, {Testing, Testing2} from './dummy/test';

describe('Spies & Stubs', function(){
  let list;

  describe('lookForStub', function(){
    let lookForStub;
    beforeEach(()=>{
      lookForStub = SpyManager.__GetDependency__('lookForStub', lookForStub);
    });

    it('should return boolean if passed', function(){
      expect(lookForStub(true)).toBeTruthy();
      expect(lookForStub(false)).toBeFalsy();
    });

    it('should return true if keyword \'stub\' passed', function(){
      expect(lookForStub('stub')).toBeTruthy();
    });

    it('should return false if anything else passed passed', function(){
      expect(lookForStub('foo')).toBeFalsy();
    });
  });

  describe('Spies & Stub Manager', function(){
    let CreateStubs, create_stubs, reset_stubs, spies_stubs;
    beforeEach(()=>{
      reset_stubs = jasmine.createSpy('reset_stubs');
      create_stubs = jasmine.createSpy('create_stubs');
      create_stubs.and.returnValue(reset_stubs);
      CreateStubs = jasmine.createSpy('CreateStubs');
      CreateStubs.and.returnValue(create_stubs);
      SpyManager.__Rewire__('CreateStubs', CreateStubs);

      spies_stubs = SpyManager('SomeModule');
    });

    afterEach(()=>{
      SpyManager.__ResetDependency__('CreateStubs');
    });

    ['add', 'get', 'getList', 'make', 'reset'].forEach((key)=>{
      it(`Should return object with ${key}`, function(){
        expect(spies_stubs.hasOwnProperty(key)).toBeTruthy();
        expect(_.isFunction(spies_stubs[key])).toBeTruthy();
      });
    });

    it('should call CreateStubs', function(){
      expect(CreateStubs).toHaveBeenCalledWith('SomeModule');
    });

    it('should create a list', function(){
      let list = spies_stubs.getList();
      expect(List.isList(list)).toBeTruthy();
      expect(list.size).toEqual(0);
    });

    describe('add', function(){
      let CompileSpies, list, rv;
      beforeEach(()=>{
        list = Immutable.fromJS([{title: 'foo'}]);
        CompileSpies = jasmine.createSpy('CompileSpies').and.returnValue(list);

        SpyManager.__Rewire__('CompileSpies', CompileSpies);

        rv = spies_stubs.add(['foo']);
      });

      afterEach(()=>{
        SpyManager.__ResetDependency__('CompileSpies');
      });

      it('should call CompileSpies', function(){
        expect(CompileSpies).toHaveBeenCalled();
        let calls = CompileSpies.calls.argsFor(0);
        expect(calls).toContain(['foo']);
      });

      it('should return a list', function(){
        let update_list = spies_stubs.getList();
        expect(update_list.equals(list)).toBeTruthy();
      });

      it('should return object', function(){
        expect(rv).toEqual(spies_stubs);
      });
    });

    describe('get', function(){
      let GetSpy, lookForStub, spy, returnSpy;
      beforeEach(()=>{
        spy = jasmine.createSpy('spy');
        GetSpy = jasmine.createSpy('GetSpy').and.returnValue(spy);
        lookForStub = jasmine.createSpy('lookForStub').and.returnValue(true);
        SpyManager.__Rewire__('GetSpy', GetSpy);
        SpyManager.__Rewire__('lookForStub', lookForStub);
        returnSpy = spies_stubs.get('foo', 'stub');
      });

      afterEach(function(){
        SpyManager.__ResetDependency__('GetSpy');
        SpyManager.__ResetDependency__('lookForStub');
      });

      it('should call GetSpy', function(){
        expect(GetSpy).toHaveBeenCalledWith(List(), 'foo', true);
      });

      it('should call lookForStub', function(){
        expect(lookForStub).toHaveBeenCalledWith('stub');
      });

      it('should return spy', function(){
        expect(returnSpy).toEqual(spy);
      });
    });

    describe('make', function(){
      let CreateSpies, list, rv;
      beforeEach(()=>{
        list = Immutable.fromJS([
          {title: 'foo', stub: false}
          , {title: 'bar', stub: true}
        ]);
        CreateSpies = jasmine.createSpy().and.returnValue(list);
        SpyManager.__Rewire__('CreateSpies', CreateSpies);
        rv = spies_stubs.make();
      });

      afterEach(function(){
        SpyManager.__ResetDependency__('CreateSpies');
      });

      it('should return object', function(){
        expect(rv).toEqual(spies_stubs);
      });

      it('should call CreateSpies', function() {
        expect(CreateSpies).toHaveBeenCalledWith(List());
      });

      it('should call create_stubs', function() {
        expect(create_stubs).toHaveBeenCalled();
      });
    });

    describe('reset', function() {
      let ResetSpies, rv;
      beforeEach(()=>{
        list = Immutable.fromJS([
          {title: 'foo', stub: false}
          , {title: 'bar', stub: true}
        ]);
        ResetSpies = jasmine.createSpy('ResetSpies')
        SpyManager.__Rewire__('CreateSpies', jasmine.createSpy().and.returnValue(list));

        SpyManager.__Rewire__('ResetSpies', ResetSpies);
        rv = spies_stubs.make().reset();
      });

      afterEach(function(){
        SpyManager.__ResetDependency__('CreateSpies');
        SpyManager.__ResetDependency__('ResetSpies')
      });

      it('should call ResetSpies', function() {
        expect(ResetSpies).toHaveBeenCalledTimes(2);
      });

      it('should call stubs_reset', function() {
        expect(reset_stubs).toHaveBeenCalled();
      });

      it('should return object', function(){
        expect(rv).toEqual(spies_stubs);
      });
    });
  });

  describe('Full Stack test', function() {
    let spies_stubs = SpyManager(Dummy);
    let rv;
    beforeEach(() => {

      spies_stubs.add([
        {
          stub: 'test1_fn'
          , callback: 'bar'
        }
      ])
    });
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

    describe('Create Spy that returns spy', function() {
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

      it('should return \'return_spy\'', function() {
        expect(rv).toEqual(spies_stubs.get('return_spy'));
      });

      it('should call spy', function() {
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('stub method', function() {

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

      it('should stub the methods', function() {
        expect(rv).toEqual('foobar');
      });

      it('should call stubs', function() {
        let stub1 = spies_stubs.get('test_fn');
        expect(stub1).toHaveBeenCalled();
        let stub2 = spies_stubs.get('test1_fn');
        expect(stub2).toHaveBeenCalled();
      });
    });

    describe('stub method return spy', function() {
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

      it('should stub the methods', function() {
        expect(rv).toEqual(spies_stubs.get('test'));
      });

      it('should call stubs', function() {
        let stub1 = spies_stubs.get('test2_fn');
        expect(stub1).toHaveBeenCalled();
      });
    });

    describe('Create Stub that returns spy obj', function() {
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

      it('should return foo if foo called', function() {
        rv = spy.foo();
        expect(rv).toEqual('foo');
        expect(spies_stubs.get('test3_fn.foo')).toHaveBeenCalled();
      });

      it('should return bar if bar called', function() {
        rv = spy.bar();
        expect(rv).toEqual('bar');
        expect(spies_stubs.get('test3_fn.bar')).toHaveBeenCalled();
      });
    });

  });
});
