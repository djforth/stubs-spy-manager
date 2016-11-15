import ResetSpy from '../../src/utils/reset_spies';

import Immutable, {Map} from 'immutable';

describe('checkSpy', function(){
  let checkSpy;
  beforeEach(()=>{
    checkSpy = ResetSpy.__GetDependency__('checkSpy');
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
  let checkObj, checkSpy, getKeys, item;
  beforeEach(()=>{
    checkObj = jasmine.createSpy().and.callFake((item)=>item.has('keys'));
    checkSpy = jasmine.createSpy().and.callFake((item)=>_.isPlainObject(item.get('spy')));
    getKeys = jasmine.createSpy().and.callFake((item)=>item.get('keys').toArray());

    ResetSpy.__Rewire__('checkObj', checkObj);
    ResetSpy.__Rewire__('checkSpy', checkSpy);
    ResetSpy.__Rewire__('getKeys', getKeys);
  });

  afterEach(()=>{
    ResetSpy.__ResetDependency__('checkObj');
    ResetSpy.__ResetDependency__('checkSpy');
    ResetSpy.__ResetDependency__('getKeys');
  });

  describe('if spy', function(){
    let im, spy;
    beforeEach(()=>{
      spy = jasmine.createSpy();
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
      spy = jasmine.createSpyObj('foo', ['bar']);
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