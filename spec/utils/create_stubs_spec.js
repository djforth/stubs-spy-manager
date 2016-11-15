import TestFn from '../dummy/test';
import Immutable from 'immutable';

import CreateStubs, {
  StubMethod
  , ResetStub
} from '../../src/utils/create_stubs';

describe('CreateStubs', function() {
  describe('StubsMethod', function() {
    let stubs, spy;
    beforeEach(()=>{
      spy = jasmine.createSpy();
      stubs = StubMethod(TestFn);
    });

    it('should return a function', function() {
      expect(_.isFunction(stubs)).toBeTruthy();
    });

    it('should stub method', function() {
      stubs('test_fn', spy);
      TestFn();
      expect(spy).toHaveBeenCalled();
      spy.calls.reset();
      TestFn.__ResetDependency__('test_fn');
      TestFn();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('ResetStub', function() {
    let reset, spy;
    beforeEach(()=>{
      spy = jasmine.createSpy();
      reset = ResetStub(TestFn);
    });

    it('should return a function', function() {
      expect(_.isFunction(reset)).toBeTruthy();
    });

    it('should stub method', function() {
      TestFn.__Rewire__('test_fn', spy);
      TestFn();
      expect(spy).toHaveBeenCalled();
      spy.calls.reset();
      reset('test_fn');
      TestFn();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Main function', function(){
    let list, manager, managerReset, reset, ResetStub, ResetSpy, stub, StubMethod, test, test1;
    beforeEach(()=>{
      test = jasmine.createSpy('test');
      test1 = jasmine.createSpy('test1');

      list = Immutable.fromJS([
        {title: 'test_fn', spy: test}
        , {title: 'test1_fn', spy: test1}
      ]);

      reset =  jasmine.createSpy('reset').and.callFake((title)=>TestFn.__ResetDependency__(title));
      stub =  jasmine.createSpy('stub').and.callFake((title, spy)=>TestFn.__Rewire__(title, spy));


      ResetStub = jasmine.createSpy('ResetStub').and.returnValue(reset);
      StubMethod = jasmine.createSpy('StubMethod').and.returnValue(stub);

      CreateStubs.__Rewire__('ResetStub', ResetStub);
      CreateStubs.__Rewire__('StubMethod', StubMethod);
      manager = CreateStubs(TestFn);
    });

    afterEach(()=>{
      CreateStubs.__ResetDependency__('ResetStub');
      CreateStubs.__ResetDependency__('StubMethod');
    });

    describe('setup', function() {
      it('should call StubMethod', function() {
        expect(StubMethod).toHaveBeenCalledWith(TestFn);
      });

      it('should return function', function() {
        expect(_.isFunction(manager)).toBeTruthy();
      });
    });

    describe('Stub list', function() {
      beforeEach(()=>{
        managerReset = manager(list);
      });

      it('should return function', function() {
        expect(_.isFunction(managerReset)).toBeTruthy();
      });

      it('should call create twice', function(){
        expect(stub).toHaveBeenCalledTimes(2);
        let call = stub.calls.argsFor(0);
        expect(call).toContain('test_fn');
        expect(call).toContain(test);

        let call1 = stub.calls.argsFor(1);
        expect(call1).toContain('test1_fn');
        expect(call1).toContain(test1);
      });

      describe('Reset', function() {
        beforeEach(() => {
          managerReset();
        });

        it('should call reset twice', function(){
          expect(reset).toHaveBeenCalledTimes(2);
          let call = reset.calls.argsFor(0);
          expect(call).toContain('test_fn');

          let call1 = reset.calls.argsFor(1);
          expect(call1).toContain('test1_fn');
        });
      });
    });
  });
});

