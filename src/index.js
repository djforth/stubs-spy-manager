import Stubs from './stubs_inner';
import Spymanager from 'spy_manager';
import Helper from 'stubs_spies_helper';

export default (module)=>{
  const spyManager = Spymanager();
  const stubsManager = Stubs(module);
  const stubs_spies = Helper(stubsManager, spyManager);

  return {
    add: (list)=>{
      stubs_spies(list);
    }
    , getSpy: (title)=>spyManager.get(title)
    , getStub: (title)=>stubsManager.get(title)
    , get: (type, title)=>{
      if (type === 'stub') return stubsManager.get(title);
      return spyManager.get(title);
    }
    , getSpyManager: ()=>spyManager
    , getStubManager: ()=>stubsManager
    , reset: ()=>{
      afterEach(()=>{
        spyManager.removeAll();
        stubsManager.revertAll(); // Reverts All stubs
      });
    }
  };
};
