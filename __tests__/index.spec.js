import SpyManager from '../src';
import Immutable, {List} from 'immutable';
import Dummy, {Testing, Testing2, Testing3} from './__dummy__/test';

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
      reset_stubs = jest.fn();
      create_stubs = jest.fn();
      create_stubs.mockReturnValue(reset_stubs);
      CreateStubs = jest.fn();
      CreateStubs.mockReturnValue(create_stubs);
      SpyManager.__Rewire__('CreateStubs', CreateStubs);

      spies_stubs = SpyManager('SomeModule');
    });

    afterEach(()=>{
      SpyManager.__ResetDependency__('CreateStubs');
    });

    ['add', 'get', 'getList', 'make', 'reset'].forEach((key)=>{
      it(`Should return object with ${key}`, function(){
        expect(spies_stubs).hasKey(key);
        expect(spies_stubs[key]).toBeFunction();
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
        CompileSpies = jest.fn('CompileSpies');
        CompileSpies.mockReturnValue(list);

        SpyManager.__Rewire__('CompileSpies', CompileSpies);

        rv = spies_stubs.add(['foo']);
      });

      afterEach(()=>{
        SpyManager.__ResetDependency__('CompileSpies');
      });

      it('should call CompileSpies', function(){
        expect(CompileSpies).toHaveBeenCalled();
        let calls = CompileSpies.mock.calls[0];
        expect(calls[0]).toContain('foo');
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
        spy = jest.fn('spy');
        GetSpy = jest.fn('GetSpy').mockReturnValue(spy);
        lookForStub = jest.fn('lookForStub').mockReturnValue(true);
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
        CreateSpies = jest.fn().mockReturnValue(list);
        SpyManager.__Rewire__('CreateSpies', CreateSpies);
        rv = spies_stubs.make();
      });

      afterEach(function(){
        SpyManager.__ResetDependency__('CreateSpies');
      });

      it('should return object', function(){
        expect(rv).toEqual(spies_stubs);
      });

      it('should call CreateSpies', function(){
        expect(CreateSpies).toHaveBeenCalledWith(List());
      });

      it('should call create_stubs', function(){
        expect(create_stubs).toHaveBeenCalled();
      });
    });

    describe('clear', function(){
      let ClearSpy, rv;
      beforeEach(()=>{
        list = Immutable.fromJS([
          {title: 'foo', stub: false}
          , {title: 'bar', stub: true}
        ]);
        // reset_stubs =
        ClearSpy = jest.fn();
        let cs = jest.fn();
        cs.mockReturnValue(list);
        SpyManager.__Rewire__('CreateSpies', cs);
        SpyManager.__Rewire__('ClearSpy', ClearSpy);
        rv = spies_stubs.make().clear();
      });

      afterEach(function(){
        SpyManager.__ResetDependency__('CreateSpies');
        SpyManager.__ResetDependency__('ClearSpy');
      });

      it('should call ClearSpy', function(){
        // console.log("EH", ClearSpy.mock.calls)
        expect(ClearSpy).toHaveBeenCalledTimes(2);
      });

      it('should call stubs_reset', function(){
        expect(reset_stubs).toHaveBeenCalled();
      });

      it('should return object', function(){
        expect(rv).toEqual(spies_stubs);
      });
    });

    describe('reset', function(){
      let ResetSpy, rv;
      beforeEach(()=>{
        list = Immutable.fromJS([
          {title: 'foo', stub: false}
          , {title: 'bar', stub: true}
        ]);
        let cs = jest.fn().mockReturnValue(list);
        SpyManager.__Rewire__('CreateSpies', cs);
        ResetSpy = jest.fn();
        SpyManager.__Rewire__('ResetSpy', ResetSpy);

        rv = spies_stubs.make().reset();
      });

      afterEach(function(){
        SpyManager.__ResetDependency__('CreateSpies');
        SpyManager.__ResetDependency__('ResetSpy');
      });

      it('should call ResetSpy', function(){
        // console.log("EH", ResetSpy.mock.calls)
        expect(ResetSpy).toHaveBeenCalledTimes(2);
      });

      it('should return object', function(){
        expect(rv).toEqual(spies_stubs);
      });
    });
  });
});
