import Helper from '../src/stubs_spies_helper';

import _ from 'lodash';

describe('Stubs spies helper', function() {
  describe('Adder', function(){
    let adder, Adder, data, manager;
    beforeEach(()=>{
      Adder = Helper.__get__('Adder');
      manager = jasmine.createSpyObj('manager', ['add']);
      adder = Adder(manager, 'type');
      data = [
        {
          type: 'foo'
          , opts: ['opt1']
        }
        , {
          type: 'bar'
          , opts: ['opt2']
        }
      ];

      adder(data);
    });

    it('should return function', function(){
      expect(_.isFunction(adder)).toBeTruthy();
    });

    it('should call add', function() {
      expect(manager.add).toHaveBeenCalled();
      let call = manager.add.calls.argsFor(0)[0];
      data.forEach((obj, i)=>{
        expect(obj.type).toEqual(call[i].title);
        expect([obj.opts]).toEqual(call[i].opts);
      })
    });
  });
});