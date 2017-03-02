
import CreateSpies, {
  AddSpy
  // , ResetSpy
} from 'utils/create_spies';

import CreateSpyObj from '../__helpers__/create_spy_obj';

import Immutable, {Map} from 'immutable';

import _ from 'lodash';

describe('CreateSpies', function(){
  describe('AddSpy', function(){
    let checkObj, getSpyName, CreateMockObj, spy, item;
    beforeEach(()=>{
      checkObj = jest.fn().mockImplementation((item)=>item.has('keys'));
      getSpyName = jest.fn().mockImplementation((item)=>item.get('title'));
      CreateMockObj = jest.fn()
                      .mockImplementation(
                        ()=>Object({foo: jest.fn()})
                      );

      CreateSpies.__Rewire__('checkObj', checkObj);
      CreateSpies.__Rewire__('CreateMockObj', CreateMockObj);
      CreateSpies.__Rewire__('getSpyName', getSpyName);
    });

    afterEach(()=>{
      CreateSpies.__ResetDependency__('checkObj');
      CreateSpies.__ResetDependency__('CreateMockObj');
      CreateSpies.__ResetDependency__('getSpyName');
    });

    it('should return null if not map', function(){
      expect(AddSpy('foo')).toBeNull();
    });

    it('should return null if no title', function(){
      expect(AddSpy(Map({foo: 'foo'}))).toBeNull();
    });

    describe('If no keys', function(){
      beforeEach(()=>{
        item = Map({title: 'foo'});
        spy = AddSpy(item);
      });

      it('should return spy', function(){
        expect(spy).toBeFunction();
      });

      it('should call checkObj', function(){
        expect(checkObj).toHaveBeenCalledWith(item);
      });

      it('should not call getkeys', function(){
        expect(CreateMockObj).not.toHaveBeenCalled();
      });
    });

    describe('If keys', function(){
      beforeEach(()=>{
        item = Map({title: 'bar', keys: ['foo']});
        spy = AddSpy(item);
      });

      it('should return spy', function(){
        expect(spy).toBeObject();
        expect(spy).hasKey('foo');
        expect(spy.foo).toBeFunction();
      });

      it('should call checkObj', function(){
        expect(checkObj).toHaveBeenCalledWith(item);
      });

      it('should not call getkeys', function(){
        expect(CreateMockObj).toHaveBeenCalledWith(item);
      });
    });
  });

  describe('checkObj', function(){
    let checkObj;
    beforeEach(()=>{
      checkObj = CreateSpies.__GetDependency__('checkObj');
    });

    it('should return false if not Map', function(){
      expect(checkObj('foo')).toBeFalsy();
    });

    it('should return false if no key', function(){
      expect(checkObj(Map({title: 'foo'}))).toBeFalsy();
    });

    it('should return false if key undefined', function(){
      expect(checkObj(Map({keys: undefined}))).toBeFalsy();
    });

    it('should return true if key defined', function(){
      expect(checkObj(Map({keys: ['foo']}))).toBeTruthy();
    });
  });

  describe('CreateMockObj', function(){
    let spyObj;
    beforeEach(()=>{
      let item = Immutable.fromJS({
        keys: [
          {title: 'foo'}
          , {title: 'bar'}
          , 'Phil'
        ]
      });

      let CreateMockObj = CreateSpies.__GetDependency__('CreateMockObj');
      spyObj = CreateMockObj(item);
    });

    it('should return object', function(){
      expect(spyObj).toBeObject();
    });

    ['foo', 'bar', 'Phil'].forEach((key)=>{
      it(`should have a spy on ${key}`, function(){
        expect(spyObj).hasKey(key);
        let spy = spyObj[key];
        expect(spy).toBeFunction();
        spy();
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  // xdescribe('getKeys', function(){
  //   let getKeys, keys;
  //   beforeEach(()=>{
  //     let item = Immutable.fromJS({
  //       keys: [
  //         {title: 'foo'}
  //         , {title: 'bar'}
  //         , 'Phil'
  //       ]
  //     });
  //     getKeys = CreateSpies.__GetDependency__('getKeys');

  //     keys = getKeys(item);
  //   });

  //   it('should return array', function(){
  //     expect(_.isArray(keys)).toBeTruthy();
  //   });

  //   ['foo', 'bar', 'Phil'].forEach((key)=>{
  //     it(`should have key ${key}`, function(){
  //       expect(keys).toContain(key);
  //     });
  //   });
  // });

  // describe('getSpyName', function(){
  //   let getSpyName;
  //   beforeEach(()=>{
  //     getSpyName = CreateSpies.__GetDependency__('getSpyName');
  //   });

  //   it('should return name if name present', function(){
  //     let item = Map({name: 'foo', title: 'bar'});
  //     expect(getSpyName(item)).toEqual('foo');
  //   });

  //   it('should return title if name not present', function(){
  //     let item = Map({title: 'bar'});
  //     expect(getSpyName(item)).toEqual('bar');
  //   });
  // });

  describe('Check if Spy obj', function(){
    let checkObj, im;
    beforeEach(()=>{
      checkObj = CreateSpies.__get__('checkObj');
    });

    it('should return false if no keys', function(){
      im = Map({spy: jasmine.createSpy(), title: 'foo', keys: undefined});
      expect(checkObj(im)).toBeFalsy();
    });

    it('should return true if keys', function(){
      im = Map({spy: CreateSpyObj('foo', ['bar']), title: 'foo', keys: ['bar']});
      expect(checkObj(im)).toBeTruthy();
    });
  });

  describe('AddCallBack', function(){
    let spy, add_callback, AddCallBack, get_callback;

    beforeEach(()=>{
      AddCallBack = CreateSpies.__GetDependency__('AddCallBack');
    });

    describe('call back null', function(){
      beforeEach(()=>{
        get_callback = jest.fn().mockImplementation(()=>Object({
          callback: null, returnSpy: false
        }));

        spy = jest.fn();

        add_callback = AddCallBack(get_callback);
        add_callback(spy, 'cb');
      });

      it('should return a function', function(){
        expect(add_callback).toBeFunction();
      });

      it('should not apply return value', function(){
        expect(spy()).toBeUndefined();
      });

      it('should call get_callback', function(){
        expect(get_callback).toHaveBeenCalledWith('cb');
      });
    });

    describe('callback function and not returnSpy', function(){
      beforeEach(()=>{
        get_callback = jest.fn().mockImplementation(()=>Object({
          callback: ()=>'foo', returnSpy: false
        }));

        spy = jest.fn();

        add_callback = AddCallBack(get_callback);
        add_callback(spy, 'cb');
      });

      it('should return a function', function(){
        expect(add_callback).toBeFunction();
      });

      it('should apply callFake', function(){
        expect(spy()).toEqual('foo');
      });

      it('should call get_callback', function(){
        expect(get_callback).toHaveBeenCalledWith('cb');
      });
    });

    describe('callback array', function(){
      beforeEach(()=>{
        get_callback = jest.fn().mockImplementation(()=>Object({
          callback: ['foo', ()=>'bar'], returnSpy: false
        }));

        spy = jest.fn();

        add_callback = AddCallBack(get_callback);
        add_callback(spy, 'cb');
      });

      it('should return a function', function(){
        expect(add_callback).toBeFunction();
      });

      it('should apply returnValues', function(){
        expect(spy()).toEqual('foo');
        expect(spy()).toEqual('bar');
      });

      it('should call get_callback', function(){
        expect(get_callback).toHaveBeenCalledWith('cb');
      });
    });

    describe('callback string', function(){
      beforeEach(()=>{
        get_callback = jest.fn().mockImplementation(()=>Object({
          callback: 'foo', returnSpy: false
        }));

        spy = jest.fn();

        add_callback = AddCallBack(get_callback);
        add_callback(spy, 'cb');
      });

      it('should return a function', function(){
        expect(add_callback).toBeFunction();
      });

      it('should apply returnValue', function(){
        expect(spy()).toEqual('foo');
      });

      it('should call get_callback', function(){
        expect(get_callback).toHaveBeenCalledWith('cb');
      });
    });

    describe('callback spy', function(){
      let return_spy;
      beforeEach(()=>{
        return_spy =  jest.fn();
        get_callback = jest.fn().mockImplementation(()=>Object({
          callback: return_spy, returnSpy: true
        }));

        spy = jest.fn();

        add_callback = AddCallBack(get_callback);
        add_callback(spy, 'cb');
      });

      it('should return a function', function(){
        expect(add_callback).toBeFunction();
      });

      it('should apply returnValue of spy', function(){
        expect(spy()).toEqual(return_spy);
      });

      it('should call get_callback', function(){
        expect(get_callback).toHaveBeenCalledWith('cb');
      });
    });
  });

  describe('GetCallBack', function(){
    let get_callback, GetCallBack, list, spy;
    beforeEach(()=>{
      spy = jest.fn();
      list = Immutable.fromJS([
        {title: 'foo', spy}
      ]);
      GetCallBack = CreateSpies.__GetDependency__('GetCallBack');
      get_callback = GetCallBack(list);
    });

    it('should return a function', function(){
      expect(_.isFunction(get_callback)).toBeTruthy();
    });

    it('should return callback if not spy', function(){
      let cb =  get_callback('foo');
      expect(cb.callback).toEqual('foo');
      expect(cb.returnSpy).toBeFalsy();
    });

    it('should return callback if map not has spy', function(){
      let item = Map({foo: 'bar'});
      let cb =  get_callback(item);
      expect(cb.callback).toEqual(item);
      expect(cb.returnSpy).toBeFalsy();
    });

    it('should return return null if spy but none found', function(){
      let item = Map({title: 'bar', spy: true});
      let cb =  get_callback(item);
      expect(cb).toBeNull();
    });

    it('should return return spy if found', function(){
      let item = Map({title: 'foo', spy: true});
      let cb =  get_callback(item);
      expect(cb.callback).toEqual(spy);
      expect(cb.returnSpy).toBeTruthy();
    });
  });

  describe('CreateCallBack', function(){
    let add_callback, CreateCallBack, create_callback;
    beforeEach(()=>{
      add_callback = jest.fn();
      CreateCallBack = CreateSpies.__GetDependency__('CreateCallBack');
      create_callback = CreateCallBack(add_callback);
    });

    it('should return function', function(){
      expect(_.isFunction(create_callback)).toBeTruthy();
    });

    it('should return with no callback', function(){
      create_callback(Map({title: 'foo'}));
      expect(add_callback).not.toHaveBeenCalled();
    });

    it('should call add_callback if callback', function(){
      create_callback(Map({spy: 'foo', callback: 'bar'}));
      expect(add_callback).toHaveBeenCalledWith('foo', 'bar');
    });

    it('should call add_callback if keys', function(){
      let keys = Immutable.fromJS([
        {title: 'foo', callback: 'cb1'}
        , {title: 'bar', callback: 'cb2'}
      ]);
      let spy = CreateSpyObj('test', ['foo', 'bar']);
      create_callback(Map({spy, keys}));
      expect(add_callback).toHaveBeenCalledTimes(2);
      keys.forEach((key, i)=>{
        let spyObj = spy[key.get('title')];
        let call = add_callback.mock.calls[i];
        expect(call).toContain(spyObj);
        expect(call).toContain(key.get('callback'));
      });
    });
  });

  describe('Main Method', function(){
    let AddCallBack
        , AddSpy
        , create_callback
        , CreateCallBack
        , GetCallBack
        , list
        , spy_list;

    beforeEach(()=>{
      list = Immutable.fromJS([
        {title: 'foo'}
        , {title: 'bar', keys: ['foo']}
      ]);

      AddSpy = jest.fn((item)=>{
        if (item.has('keys')){
          return CreateSpyObj('bar', ['foo']);
        }

        return jest.fn();
      });

      AddCallBack = jasmine.createSpy().and.returnValue('add_callback');
      create_callback = jest.fn();
      CreateCallBack = jasmine.createSpy().and.returnValue(create_callback);
      GetCallBack = jasmine.createSpy().and.returnValue('get_callback');

      CreateSpies.__Rewire__('AddCallBack', AddCallBack);
      CreateSpies.__Rewire__('AddSpy', AddSpy);
      CreateSpies.__Rewire__('CreateCallBack', CreateCallBack);
      CreateSpies.__Rewire__('GetCallBack', GetCallBack);
      spy_list = CreateSpies(list);
    });

    afterEach(()=>{
      CreateSpies.__ResetDependency__('AddCallBack');
      CreateSpies.__ResetDependency__('AddSpy');
      CreateSpies.__ResetDependency__('CreateCallBack');
      CreateSpies.__ResetDependency__('GetCallBack');
    });

    it('should call AddSpy', function(){
      expect(AddSpy).toHaveBeenCalledTimes(2);
      list.forEach((item, i)=>{
        let calls = AddSpy.mock.calls[i];
        expect(calls).toContain(item);
      });
    });

    it('should call GetCallBack', function(){
      expect(GetCallBack).toHaveBeenCalledWith(spy_list);
    });

    it('should call AddCallBack', function(){
      expect(AddCallBack).toHaveBeenCalledWith('get_callback');
    });

    it('should call CreateCallBack', function(){
      expect(CreateCallBack).toHaveBeenCalledWith('add_callback');
    });

    it('should call create_callback', function(){
      expect(create_callback).toHaveBeenCalledTimes(2);
    });

    it('should add spy to each item', function(){
      spy_list.forEach((item, i)=>{
        expect(item.has('spy')).toBeTruthy();
        let spy = item.get('spy');
        expect(spy).toBeDefined();
      });
    });
  });
});
