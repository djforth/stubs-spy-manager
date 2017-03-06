import {List} from 'immutable';
import _ from 'lodash';
import CompileSpies from './utils/compile_spies';
import CreateSpies from './utils/create_spies';
import CreateStubs from './utils/create_stubs';
import GetSpy from './utils/get_spy';
import {
  ClearSpy
  , ResetSpy
}  from './utils/reset_spies';


const lookForStub = (stubber)=>{
  if (typeof stubber === 'boolean') return stubber;
  if (stubber === 'stub') return true;
  return false;
};

export default (module)=>{
  let spies_list = List();
  let create_stubs = CreateStubs(module);
  let stubs_reset, obj;
  obj = {
    add: (list)=>{
      spies_list = CompileSpies(list, spies_list);
      return obj;
    }
    , clear(){
      if (_.isFunction(stubs_reset)) stubs_reset();
      spies_list.forEach(ClearSpy);
      // spies_list = [];
      return obj;
    }
    , clearList(){
      obj.clear();
      spies_list = [];
      return obj;
    }
    , get: (title, stub = false)=>{
      return GetSpy(spies_list, title, lookForStub(stub));
    }
    , getFn: (mod)=>module.__GetDependency__(mod)
    , getList: ()=>spies_list
    , make: ()=>{
      spies_list = CreateSpies(spies_list);
      let stubs_list = spies_list.filter(
        (item)=>item.has('stub') &&
          item.get('stub')
        );
      stubs_reset = create_stubs(stubs_list);
      return obj;
    }
    , reset(){
      spies_list.forEach(ResetSpy);
      return obj;
    }
  };

  return obj;
};
