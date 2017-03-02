import CompileSpies from 'utils/compile_spies';
import {List, Map} from 'immutable';

describe('CompileSpies', function(){
  describe('Main Function', function(){
    let creator, CreateItem, GetTitleAndKeys, list, Merger;
    beforeEach(()=>{
      // titleKeys = jest.fn((title)=>{
      //   if (title === null) return null;
      //   return {title};
      // });

      creator = jest.fn((title)=>{
        if (title === null) return null;
        return Map({title});
      });
      CreateItem = jasmine.createSpy().and.returnValue(creator);
      Merger = jest.fn((list, item)=>list.push(item));
      GetTitleAndKeys = jasmine.createSpy().and.returnValue('getTitleAndKeys');
      CompileSpies.__Rewire__('GetTitleAndKeys', GetTitleAndKeys);
      CompileSpies.__Rewire__('CreateItem', CreateItem);
      CompileSpies.__Rewire__('Merger', Merger);
      CompileSpies.__Rewire__('ConstructFromArray', 'constructFromArray');
      CompileSpies.__Rewire__('ConstructFromObject', 'constructFromObject');
      CompileSpies.__Rewire__('ConstructFromString', 'constructFromString');
      list = CompileSpies(['foo', null, 'bar']);
    });

    afterEach(()=>{
      CompileSpies.__ResetDependency__('GetTitleAndKeys');
      CompileSpies.__ResetDependency__('CreateItem');
      CompileSpies.__ResetDependency__('Merger');
      CompileSpies.__ResetDependency__('ConstructFromArray');
      CompileSpies.__ResetDependency__('ConstructFromObject');
      CompileSpies.__ResetDependency__('ConstructFromString');
    });

    it('should return correct List', function(){
      expect(List.isList(list)).toBeTruthy();
      expect(list.size).toEqual(2);
      list.forEach((item)=>{
        expect(item.has('title')).toBeTruthy();
        expect(item.get('title')).toEqual(jasmine.anything());
      });
    });

    it('should call getTitleAndKeys', function(){
      expect(GetTitleAndKeys).toHaveBeenCalledWith(['constructFromArray', 'constructFromObject', 'constructFromString']);
    });

    it('should call CreateItem', function(){
      expect(CreateItem).toHaveBeenCalledWith('getTitleAndKeys');
    });

    it('should call creator', function(){
      expect(creator).toHaveBeenCalledTimes(3);
      ['foo', null, 'bar'].forEach((val, i)=>{
        let calls = creator.mock.calls[i];
        expect(calls).toContain(val);
      });
    });

    it('should call Merger', function(){
      expect(Merger).toHaveBeenCalledTimes(2);

      [Map({title: 'foo'}), Map({title: 'bar'})].forEach((val, i)=>{
        let calls = Merger.mock.calls[i][1];
        expect(calls.equals(val)).toBeTruthy();
      });
    });
  });
});
