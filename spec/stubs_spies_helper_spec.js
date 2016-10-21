import Helper from '../src/stubs_spies_helper';

import _ from 'lodash';

describe('Stubs spies helper', function() {
  describe('Splitter', function() {
    let splitter;

    beforeEach(()=>{
      splitter = Helper.__get__('splitter');
    });

    it('should return object with title if no .', function() {
      let obj = splitter('foo');
      expect(obj.title).toEqual('foo');
      expect(_.has(obj, 'opts')).toBeFalsy();
    });

    it('should return object with title if no .', function() {
      let obj = splitter('foo.bar');
      expect(obj.title).toEqual('foo');
      expect(obj.opts).toEqual(['bar']);
    });
  });

  describe('matchItem', function() {
    let matchItem, data;

    beforeEach(()=>{
      matchItem = Helper.__get__('matchItem');
      data = ['foo', {title: 'bar'}];
    });

    it('should return foo', function() {
      let item = matchItem(data, 'foo');
      expect(item).toEqual('foo');
    });

    it('should return bar', function() {
      let item = matchItem(data, 'bar');
      expect(item).toEqual({title: 'bar'});
    });

    it('should return undefined if none', function() {
      let item = matchItem(data, 'bar2');
      expect(item).toBeUndefined();
    });
  });

  describe('getIndexOf', function() {
    let indexOf, list;

    beforeEach(()=>{
      indexOf = Helper.__get__('getIndexOf');
      list = ['foo', {title: 'bar', opts: ['foo']}];
    });

    it('should return index of foo', function() {
      expect(indexOf(list, 'foo')).toEqual(0);
    });

    it('should return index of bar', function() {
      expect(indexOf(list, {title: 'bar', opts: ['foo']})).toEqual(1);
    });

    it('should return -1 if no array', function() {
      expect(indexOf({}, {title: 'aaa', opts: ['foo']})).toEqual(-1);
    });

    it('should return -1 if nothing found', function() {
      expect(indexOf({}, {title: 'bar', opts: ['foo']})).toEqual(-1);
    });
  });

  describe('mergeItem', function(){
    let mergeItem, data, list;

    beforeEach(()=>{


      mergeItem = Helper.__get__('mergeItem');
      list = ['foo', {title: 'bar', opts: ['foo']}];
    });

    afterEach(()=>{

    })

    it('should update foo', function(){
      data = {title: 'foo', opts: ['bar']};
      let newList = mergeItem(list, 'foo', data);
      expect(newList.length).toEqual(2);
      expect(newList).not.toEqual(list);
      expect(newList[0]).toEqual(data);
    });

    it('should update bar', function(){
      data = {title: 'bar', opts: ['bar']};
      let newList = mergeItem(list, {title: 'bar', opts: ['foo']}, data);
      expect(newList.length).toEqual(2);
      expect(newList).not.toEqual(list);
      expect(newList[1].title).toEqual('bar');
      expect(newList[1].opts).toEqual(['foo', 'bar']);
    });
  });

  describe('createNewItem', function() {
    let createNewItem;
    beforeEach(()=>{
      createNewItem = Helper.__get__('createNewItem');
    });

    it('should return array with string if no opts', function() {
      let item = createNewItem({title: 'foo'})

      expect(_.isArray(item)).toBeTruthy();
      expect(item[0]).toEqual('foo');
    });

    it('should return array with object if opts', function() {
      let data = {title: 'foo', opts: []}
      let item = createNewItem(data);

      expect(_.isArray(item)).toBeTruthy();
      expect(item[0]).toEqual(data);
    });
  });

  describe('Adder', function(){
    let adder, Adder, data, manager, reverts;
    beforeEach(()=>{
      reverts = [];
      Adder = Helper.__get__('Adder');

      manager = jasmine.createSpyObj('manager', ['add']);
      adder = Adder(manager, 'type');
      data = [
        {
          type: 'foo.phil'
        }
        , {
          type: 'foo.bar'
        }
        , {
          type: 'bar'
        }
      ];

      adder(data);
    });

    it('should return function', function(){
      expect(_.isFunction(adder)).toBeTruthy();
    });

    it('should call add', function() {
      expect(manager.add).toHaveBeenCalled();
    });

    it('should set up foo with phil & bar ', function() {
      let call = manager.add.calls.argsFor(0)[0];
      expect(call[0]).toEqual({title: 'foo', opts: ['phil', 'bar']});
    });

    it('should set up bar ', function() {
      let call = manager.add.calls.argsFor(0)[0];
      expect(call[1]).toEqual('bar');
    });

    // it('should call add', function() {
    //   expect(manager.add).toHaveBeenCalled();
    //   let call = manager.add.calls.argsFor(0)[0];
    //   data.forEach((obj, i)=>{
    //     expect(obj.type).toEqual(call[i].title);
    //     expect([obj.callback]).toEqual(call[i].opts);
    //   })
    // });
  });
});