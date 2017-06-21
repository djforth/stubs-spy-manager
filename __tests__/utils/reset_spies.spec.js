import ResetSpies, {
  ClearSpy
  , ResetSpy
} from 'utils/reset_spies';
import _ from 'lodash';
import Immutable, {Map} from 'immutable';
import CreateSpyObj from '../__helpers__/create_spy_obj';

describe('checkSpy', function(){
  let checkSpy;
  beforeEach(()=>{
    checkSpy = ResetSpies.__GetDependency__('checkSpy');
  });

  it('should return false if no spy', function(){
    let item = Map({foo: 'foo'});
    expect(checkSpy(item)).toBeFalsy();
  });

  it('should return false if spy, but not object', function(){
    let item = Map({spy: 'foo'});
    expect(checkSpy(item)).toBeFalsy();
  });

  it('should return true if object', function(){
    let item = Map({spy: {foo: 'foo'}});
    expect(checkSpy(item)).toBeTruthy();
  });
});

describe('ResetSpy', function(){
  let checkObj, checkSpy, getKeys;
  beforeEach(()=>{
    checkObj = jest.fn((item)=>item.has('keys'));
    checkSpy = jest.fn((item)=>_.isPlainObject(item.get('spy')));
    getKeys = jest.fn((item)=>item.get('keys').toArray());

    ResetSpies.__Rewire__('checkObj', checkObj);
    ResetSpies.__Rewire__('checkSpy', checkSpy);
    ResetSpies.__Rewire__('getKeys', getKeys);
  });

  afterEach(()=>{
    ResetSpies.__ResetDependency__('checkObj');
    ResetSpies.__ResetDependency__('checkSpy');
    ResetSpies.__ResetDependency__('getKeys');
  });

  describe('if spy', function(){
    let im, spy;
    beforeEach(()=>{
      spy = jest.fn();
      im = Map({spy, title: 'foo'});
    });

    it('should reset spy', function(){
      spy();
      expect(spy).toHaveBeenCalled();
      ResetSpy(im);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('if spy object', function(){
    let im, spy;
    beforeEach(()=>{
      spy = CreateSpyObj('foo', ['bar']);
      im = Immutable.fromJS({title: 'foo', keys: ['bar']});
      im = im.set('spy', spy);
    });

    it('should reset spy', function(){
      spy.bar();
      expect(spy.bar).toHaveBeenCalled();
      ResetSpy(im);
      expect(spy.bar).not.toHaveBeenCalled();
    });
  });
});

describe('ClearSpy', function(){
  let checkObj, checkSpy, getKeys;
  beforeEach(()=>{
    checkObj = jest.fn((item)=>item.has('keys'));
    checkSpy = jest.fn((item)=>_.isPlainObject(item.get('spy')));
    getKeys = jest.fn((item)=>item.get('keys').toArray());

    ResetSpies.__Rewire__('checkObj', checkObj);
    ResetSpies.__Rewire__('checkSpy', checkSpy);
    ResetSpies.__Rewire__('getKeys', getKeys);
  });

  afterEach(()=>{
    ResetSpies.__ResetDependency__('checkObj');
    ResetSpies.__ResetDependency__('checkSpy');
    ResetSpies.__ResetDependency__('getKeys');
  });

  describe('if spy', function(){
    let im, spy;
    beforeEach(()=>{
      spy = jest.fn();
      im = Map({spy, title: 'foo'});
    });

    it('should reset spy', function(){
      spy();
      expect(spy).toHaveBeenCalled();
      ClearSpy(im);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('if spy object', function(){
    let im, spy;
    beforeEach(()=>{
      spy = CreateSpyObj('foo', ['bar']);
      im = Immutable.fromJS({title: 'foo', keys: ['bar']});
      im = im.set('spy', spy);
    });

    it('should reset spy', function(){
      spy.bar();
      expect(spy.bar).toHaveBeenCalled();
      ClearSpy(im);
      expect(spy.bar).not.toHaveBeenCalled();
    });
  });
});
