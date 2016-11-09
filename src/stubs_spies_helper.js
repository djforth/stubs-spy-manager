import _ from 'lodash';

// const createStubsAndSpies = (stubs, spyManager)=>(items)=>{
//   stubs.add(items);
//   let spyManger = items.map((item)=>`${item}Something`);
//   spyManager.add(spyManger);

//   items.forEach((item)=>{
//     stubs.return(item)('returnValue', spyManager.get(`${item}Something`));
//   });
// };

const splitTitle = (t)=>{
  if (_.isString(t)){
    return (t.match(/\./)) ? t.split('.') : [t];
  }

  return t;
};

const setReturnType = (returnType, callback)=>{
  if (returnType) return returnType;
  return (_.isFunction(callback)) ? 'callFake' : 'returnValue';
};

const CreateSpy = (spyManager)=>(item)=>{
  if (_.has(item, 'callback') || _.has(item, 'returnSpy')){
    let {spy, returnType, callback, returnSpy} = item;
    let title = splitTitle(spy);
    if (returnSpy){
      // spy = createSpy(spy);
      spyManager.addReturn.apply(this, title)('returnValue', spyManager.get(returnSpy));
    } else {
      returnType = setReturnType(returnType, callback);
      spyManager.addReturn.apply(this, title)(returnType, callback);
    }

    return spyManager.get(title[0]);
  }

  spyManager.add(item);
  return spyManager.get(item);
};

const CreateStub = (stubs, createSpy)=>(item)=>{
  if (_.has(item, 'callback') || _.has(item, 'spy')){
    let {stub, returnType, callback, spy} = item;
    let title = splitTitle(stub);
    if (spy){
      spy = createSpy(spy);
      stubs.return.apply(this, title)('returnValue', spy);
    } else {
      returnType = setReturnType(returnType, callback);
      stubs.return.apply(this, title)(returnType, callback);
    }

    return stubs.get(title[0]);
  }

  stubs.add(item);
  return stubs.get(item);
};

const splitter = (item)=>{
  let title, opts;
  if (item.match(/\./)){
    let split = item.split('.');
    title = split[0];
    opts = [split[1]];
    return {title, opts};
  }

  return {title: item};
};

const matchItem = (list, title)=>{
  let matched = list.filter((item)=>{
    if (_.isString(item)) return item === title;
    if (_.isPlainObject(item)) return item.title === title;

    return false;
  });

  return matched[0];
};

const getIndexOf = (list, item)=>{
  if (!_.isArray(list) || _.isUndefined(item)) return -1;
  let titles = list.map((l)=>{
    if (_.isString(l)) return l;
    return l.title;
  });
  let title = (_.isString(item)) ? item : item.title;
  return titles.indexOf(title);
};

const mergeItem = (list, item, data)=>{
  let i = getIndexOf(list, item);
  let newList = list.slice();
  if (_.isPlainObject(item)){
    data.opts = item.opts.concat(data.opts);
  }
  newList[i] = data;
  return newList;
};

const createNewItem = (item)=>{
  if (_.has(item, 'opts')) return [item];
  return [item.title];
};

const Adder = (typeManager, type)=>(types)=>{
  let type_objs = types.reduce((prev, curr)=>{
    if (_.isString(curr)) return prev.concat([curr]);
    let split = splitter(curr[type]);
    let has = matchItem(prev, split.title);
    if (has){
      return mergeItem(prev, has, split);
    }

    return prev.concat(createNewItem(split));
  }, []);
  typeManager.add(type_objs);
};

export default (stubs, spyManager)=>{
  const addSpies = Adder(spyManager, 'spy');
  const addStubs = Adder(stubs, 'stub');
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
