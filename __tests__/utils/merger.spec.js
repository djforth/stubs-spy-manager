import Merger from 'utils/merger';
import Immutable, {Map} from 'immutable';


describe('Merger', function(){
  let list;
  beforeEach(()=>{
    list = Immutable.fromJS([
      {
        title: 'bar'
        , stub: false
        , callback: {spy: true, title: 'bar2'}
      }
      , {
        title: 'foo'
        , stub: true
        , keys: [
          {
            title: 'bar', callback: {
              spy: true, title: 'bar'
            }
          }
          , {title: 'phil', callback: 'Phil'}
        ]
      }
    ]);
  });

  describe('mergeKeys', function(){
    let mergeKeys, item;
    beforeEach(()=>{
      item = list.get(1);
      mergeKeys = Merger.__GetDependency__('mergeKeys');
    });

    it('should merge keys from item', function(){
      let new_item = Immutable.fromJS({
        title: 'foo'
        , stub: true
        , keys: [
          {title: 'bar3', callback: 'foo'}
        ]
      });
      let update_item = mergeKeys(item, new_item);
      let keys = update_item.get('keys');
      expect(keys.size).toEqual(3);
      expect(keys.includes(Map({title: 'bar3', callback: 'foo'}))).toBeTruthy();
    });

    it('should not merge if matching', function(){
      let new_item = Immutable.fromJS({
        title: 'foo'
        , stub: true
        , keys: [
          {title: 'phil', callback: 'Phil'}
        ]
      });
      let update_item = mergeKeys(item, new_item);
      let keys = update_item.get('keys');
      expect(keys.size).toEqual(2);
      expect(keys.includes(Map({title: 'phil', callback: 'Phil'}))).toBeTruthy();
    });

    it('should create keys if none exist', function(){
      let new_item = Immutable.fromJS({
        title: 'foo'
        , stub: true
        , keys: [
          {title: 'phil', callback: 'Phil'}
        ]
      });
      item = Immutable.fromJS({title: 'foo', stub: true});
      let update_item = mergeKeys(item, new_item);
      let keys = update_item.get('keys');
      expect(keys.size).toEqual(1);
      expect(keys.includes(Map({title: 'phil', callback: 'Phil'}))).toBeTruthy();
    });  });

  describe('checkTitle', function(){
    let checkTitle;
    beforeEach(()=>{
      checkTitle = Merger.__GetDependency__('checkTitle');
    });

    it('should return item if no matches', function(){
      let new_item = Map({title: 'bar2'});
      let updated = checkTitle(list, new_item);
      let new_list = list.push(new_item);
      expect(new_list.equals(updated)).toBeTruthy();
    });

    it('should return item if matches stub', function(){
      let new_item = Map({title: 'bar', stub: true});
      let updated_list = checkTitle(list, new_item);
      let updated = updated_list.last();
      let current = updated_list.first();
      expect(new_item.equals(updated)).toBeFalsy();
      expect(updated.has('name')).toBeTruthy();
      expect(updated.get('name')).toEqual('bar-stub');

      expect(current.has('name')).toBeTruthy();
      expect(current.get('name')).toEqual('bar-spy');
    });
  });

  describe('Main method', function(){
    let checkTitle, update, new_item, update_item, spy;
    beforeEach(()=>{
      update_item = Immutable.fromJS({
        title: 'foo'
        , stub: true
        , keys: [
          {
            title: 'bar', callback: {
              spy: true, title: 'bar'
            }
          }
          , {title: 'phil', callback: 'Phil'}
          , {title: 'bar3', callback: 'bar3'}
        ]
      });

      spy = jest.fn(()=>update_item);
      checkTitle = jest.fn((list, item)=>list.push(item));

      Merger.__Rewire__('mergeKeys', spy);
      Merger.__Rewire__('checkTitle', checkTitle);
    });

    afterEach(()=>{
      Merger.__ResetDependency__('mergeKeys');
      Merger.__ResetDependency__('checkTitle');
    });

    it('should update if matched', function(){
      new_item = Immutable.fromJS({
        title: 'foo'
        , stub: true
        , keys: [
          {title: 'bar3', callback: 'foo'}
        ]
      });

      update = Merger(list, new_item);
      expect(update.equals(list)).toBeFalsy();
      expect(update.size).toEqual(2);
      expect(spy).toHaveBeenCalledWith(list.get(1), new_item);
      expect(checkTitle).not.toHaveBeenCalled();
    });

    it('should add new if no match', function(){
      new_item = Immutable.fromJS({
        title: 'phil2'
        , stub: true
        , callback: 'phil'
      });
      update = Merger(list, new_item);
      expect(update.equals(list)).toBeFalsy();
      expect(update.size).toEqual(3);
      expect(update.includes(new_item)).toBeTruthy();
      expect(spy).not.toHaveBeenCalled();
      expect(checkTitle).toHaveBeenCalledWith(list, new_item);
    });
  });
});
