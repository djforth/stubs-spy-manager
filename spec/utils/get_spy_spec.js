import GetSpy from '../../src/utils/get_spy';
import Immutable, {Map, List} from 'immutable';

describe('get spies', function(){
  let list;
  beforeEach(()=>{
    list = Immutable.fromJS([
      {
        title: 'foo'
        , name: 'foo-spy'
        , stub: false
        , spy: jasmine.createSpy()
      }
      , {
        title: 'foo'
        , name: 'foo-stub'
        , stub: true
        , spy: jasmine.createSpyObj('foo-stub', ['bar'])
      }
      , {
        title: 'bar'
        , stub: true
        , spy: jasmine.createSpy()
      }
    ]);
  });

  describe('FindSpies', function(){
    let FindSpies;

    beforeEach(()=>{
      FindSpies = GetSpy.__GetDependency__('FindSpies');
    });

    it('should return null if none found', function(){
      expect(FindSpies(list, 'phil')).toBeNull();
    });

    it('should return bar', function(){
      let item = FindSpies(list, 'bar');
      expect(item.equals(list.last())).toBeTruthy();
    });

    it('should return foo-spy', function(){
      let item = FindSpies(list, 'foo', false);
      expect(item.equals(list.first())).toBeTruthy();
    });

    it('should return foo-stub', function(){
      let item = FindSpies(list, 'foo', true);
      expect(item.equals(list.get(1))).toBeTruthy();
    });
  });

  describe('getTitleAndKeys', function(){
    let getTitleAndKey, splitter;
    splitter = jasmine.createSpy().and.returnValues(
      ['foo', 'bar']
      , 'foo'
      , {title: 'foo'}
      , {bar: 'foo'}
    );
    beforeEach(()=>{
      GetSpy.__Rewire__('Splitter', splitter);
      getTitleAndKey = GetSpy.__GetDependency__('getTitleAndKey');
    });

    afterEach(function(){
      GetSpy.__ResetDependency__('Splitter');
    });

    it('should process array', function(){
      let value = getTitleAndKey('foo.bar');
      expect(value).toEqual({title: 'foo', key: 'bar'});
      expect(splitter).toHaveBeenCalledWith('foo.bar');
    });

    it('should process string', function(){
      let value = getTitleAndKey('foo');
      expect(value).toEqual({title: 'foo'});
      expect(splitter).toHaveBeenCalledWith('foo');
    });

    it('should process object with title', function(){
      let value = getTitleAndKey({title: 'foo'});
      expect(value).toEqual({title: 'foo'});
      expect(splitter).toHaveBeenCalledWith({title: 'foo'});
    });

    it('should return null if object incorrect', function(){
      let value = getTitleAndKey({foo: 'foo'});
      expect(value).toBeNull();
      expect(splitter).toHaveBeenCalledWith({foo: 'foo'});
    });
  });

  describe('main method', function(){
    let FindSpies, getTitleAndKey, tk, spyMap;
    beforeEach(()=>{
      getTitleAndKey = jasmine.createSpy().and.callFake(()=>tk);
      FindSpies = jasmine.createSpy().and.callFake(()=>spyMap);
      GetSpy.__Rewire__('getTitleAndKey', getTitleAndKey);
      GetSpy.__Rewire__('FindSpies', FindSpies);
    });

    afterEach(function(){
      GetSpy.__ResetDependency__('getTitleAndKey');
      GetSpy.__ResetDependency__('FindSpies');
    });

    it('should return null if no list passes', function(){
      expect(GetSpy('foo', 'bar')).toBeNull();
      expect(getTitleAndKey).not.toHaveBeenCalled();
      expect(FindSpies).not.toHaveBeenCalled();
    });

    it('should return null if list empty', function(){
      expect(GetSpy(List(), 'bar')).toBeNull();
      expect(getTitleAndKey).not.toHaveBeenCalled();
      expect(FindSpies).not.toHaveBeenCalled();
    });

    it('should return null if invalid title', function(){
      tk = null;
      expect(GetSpy(list, 'bar')).toBeNull();
      expect(getTitleAndKey).toHaveBeenCalledWith('bar');
      expect(FindSpies).not.toHaveBeenCalled();
    });

    it('should return null if no spy found', function(){
      tk = {title: 'foo'};
      spyMap = null;
      expect(GetSpy(list, 'bar')).toBeNull();
      expect(getTitleAndKey).toHaveBeenCalledWith('bar');
      expect(FindSpies).toHaveBeenCalled();
      let calls = FindSpies.calls.argsFor(0);
      expect(calls).toContain(list);
      expect(calls).toContain(false);
      expect(calls).toContain('foo');
    });

    it('should return null if no spy created', function(){
      tk = {title: 'foo'};
      spyMap = Map({title: 'foo'});
      expect(GetSpy(list, 'bar')).toBeNull();
      expect(getTitleAndKey).toHaveBeenCalledWith('bar');
      expect(FindSpies).toHaveBeenCalled();
      let calls = FindSpies.calls.argsFor(0);
      expect(calls).toContain(list);
      expect(calls).toContain(false);
      expect(calls).toContain('foo');
    });

    it('should return spy if found', function(){
      let spy = jasmine.createSpy('foo');
      tk = {title: 'foo'};
      spyMap = Map({spy});
      let returnSpy = GetSpy(list, 'bar');
      expect(returnSpy).toEqual(spy);
      expect(returnSpy.and.identity()).toEqual('foo');
      expect(getTitleAndKey).toHaveBeenCalledWith('bar');
      expect(FindSpies).toHaveBeenCalled();
      let calls = FindSpies.calls.argsFor(0);
      expect(calls).toContain(list);
      expect(calls).toContain(false);
      expect(calls).toContain('foo');
    });

    it('should return spy object if found', function(){
      let spy = jasmine.createSpyObj('foo', ['bar']);
      tk = {title: 'foo', key: 'bar'};
      spyMap = Map({spy});
      let returnSpy = GetSpy(list, 'bar');
      expect(returnSpy).toEqual(spy.bar);

      expect(getTitleAndKey).toHaveBeenCalledWith('bar');
      expect(FindSpies).toHaveBeenCalled();
      let calls = FindSpies.calls.argsFor(0);
      expect(calls).toContain(list);
      expect(calls).toContain(false);
      expect(calls).toContain('foo');
    });
  });
});
