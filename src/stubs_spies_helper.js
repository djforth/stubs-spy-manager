import _ from 'lodash';

export const createStubsAndSpies = (stubs, spyManager)=>(items)=>{
  stubs.add(items);
  let spyManger = items.map((item)=>`${item}Something`);
  spyManager.add(spyManger);

  items.forEach((item)=>{
    stubs.return(item)('returnValue', spyManager.get(`${item}Something`));
  });
};

const setReturnType = (returnType, callback)=>{
  if (returnType) return returnType;
  return (_.isFunction(callback)) ? 'callFake' : 'returnValue';
};

const CreateSpy = (spyManager)=>(item)=>{
  if (_.has(item, 'callback') || _.has(item, 'returnSpy')){
    let {spy, returnType, callback, returnSpy} = item;
    title = (_.isArray(spy)) ? spy : [spy];
    if (returnSpy){
      // spy = createSpy(spy);
      spyManager.addReturn.apply(this, title)('returnValue', spyManager.get(returnSpy));
    } else {
      returnType = setReturnType(returnType, callback);
      spyManager.addReturn.apply(this, title)(returnType, callback);
    }

    return spyManager.get(title[0]);
  }

  spyManager.add(spy);
  return spyManager.get(spy);
};

const CreateStub = (stubs, createSpy)=>(item)=>{
  if (_.has(item, 'callback') || _.has(item, 'spy')){
    let {stub, returnType, callback, spy} = item;
    title = (_.isArray(stub)) ? stub : [stub];
    if (spy){
      spy = createSpy(spy);
      stubs.return.apply(this, title)('returnValue', spy);
    } else {
      returnType = setReturnType(returnType, callback);
      stubs.return.apply(this, title)(returnType, callback);
    }

    return stubs.get(title[0]);
  }

  stubs.add(stub);
  return stubs.get(stub);
};

const Adder = (typeManager)=>(types)=>{
  let type_objs = types.reduce((prev, curr)=>{
    if (_.isString(curr)) return prev.concat([curr]);
    let [title, opts] = curr;
    let has = _.find(prev, (p)=>_.isPlainObject(p) && p.title === title);
    if (has){
      return prev.map((pr)=>{
        if (pr.title !==  title){
          return pr;
        }

        pr.opts = pr.opts.concat([opts]);
        return pr;
      });
    }

    return prev.concat([{
      title: title
      , opts: [opts]
    }]);
  }, []);
  // console.log(type_objs)
  typeManager.add(type_objs);
};

export default (stubs, spyManager)=>{
  const addSpies = Adder(spyManager);
  const addStubs = Adder(stubs);
  const createSpy = CreateSpy(spyManager);
  const createStub = CreateStub(stubs, createSpy);

  return (list)=>{
    const spies = list.filter((item)=>_.has(item, 'spy') && !_.has(item, 'stub'));
    const stubs_list = list.filter((item)=>_.has(item, 'stub'));
    addSpies(spies);
    addStubs(stubs_list);

    list.forEach((item)=>{
      if (_.has(item, 'stub')){
        createStub(item);
      } else if (_.has(item, 'spy')){
        createSpy(item);
      }
    });
  };
};
