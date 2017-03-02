import TestFn from '../__dummy__/test';
import Immutable from 'immutable';

import CreateStubs, {
  StubMethod
  , ResetStub
} from 'utils/create_stubs';

describe('CreateStubs', function(){
  describe('StubsMethod', function(){
    let stubs, spy;
    beforeEach(()=>{
      spy = jest.fn();
      stubs = StubMethod(TestFn);
    });

    it('should return a function', function(){
      expect(stubs).toBeFunction();
    });

    it('should stub method', function(){
      stubs('test_fn', spy);
      TestFn();
      expect(spy).toHaveBeenCalled();
      spy.mockReset();
      TestFn.__ResetDependency__('test_fn');
      TestFn();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('ResetStub', function(){
    let reset, spy;
    beforeEach(()=>{
      spy = jest.fn();
      reset = ResetStub(TestFn);
    });

    it('should return a function', function(){
      expect(reset).toBeFunction();
    });

    it('should stub method', function(){
      TestFn.__Rewire__('test_fn', spy);
      TestFn();
      expect(spy).toHaveBeenCalled();
      spy.mockReset();
      reset('test_fn');
      TestFn();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Main function', function(){
    let list
        , manager
        , managerReset
        , reset
        , ResetStub
        , stub
        , StubMethod
        , test
        , test1;
    beforeEach(()=>{
      test = jest.fn();
      test1 = jest.fn();

      list = Immutable.fromJS([
        {title: 'test_fn', spy: test}
        , {title: 'test1_fn', spy: test1}
      ]);

      reset =  jest.fn(()=>(title)=>TestFn.__ResetDependency__(title));
      stub =  jest.fn(()=>(title, spy)=>TestFn.__Rewire__(title, spy));


      ResetStub = jest.fn(()=>reset);
      StubMethod = jest.fn(()=>stub);

      CreateStubs.__Rewire__('ResetStub', ResetStub);
      CreateStubs.__Rewire__('StubMethod', StubMethod);
      manager = CreateStubs(TestFn);
    });

    afterEach(()=>{
      CreateStubs.__ResetDependency__('ResetStub');
      CreateStubs.__ResetDependency__('StubMethod');
    });

    describe('setup', function(){
      it('should call StubMethod', function(){
        expect(StubMethod).toHaveBeenCalledWith(TestFn);
      });

      it('should return function', function(){
        expect(manager).toBeFunction();
      });
    });

    describe('Stub list', function(){
      beforeEach(()=>{
        managerReset = manager(list);
      });

      it('should return function', function(){
        expect(managerReset).toBeFunction();
      });

      it('should call create twice', function(){
        expect(stub).toHaveBeenCalledTimes(2);
        let call = stub.mock.calls[0];
        expect(call).toContain('test_fn');
        expect(call).toContain(test);

        let call1 = stub.mock.calls[1];
        expect(call1).toContain('test1_fn');
        expect(call1).toContain(test1);
      });

      describe('Reset', function(){
        beforeEach(()=>{
          managerReset();
        });

        it('should call reset twice', function(){
          expect(reset).toHaveBeenCalledTimes(2);
          let call = reset.mock.calls[0];
          expect(call).toContain('test_fn');

          let call1 = reset.mock.calls[1];
          expect(call1).toContain('test1_fn');
        });
      });
    });
  });
});

