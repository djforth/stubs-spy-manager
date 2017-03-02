import Immutable, {List} from 'immutable';
import Merger from './merger';

import GetTitleAndKeys, {
  ConstructFromArray
  , ConstructFromObject
  , ConstructFromString
  , Splitter
} from './title_keys';

import CreateCallbacks from './create_callbacks';

const getTitle = (item)=>{
  if (item.hasOwnProperty('stub')){
    return {
      title: Splitter(item.stub)
      , stub: true
    };
  }

  return {
    title: Splitter(item.spy)
    , stub: false
  };
};

const CreateItem = (titleAndKeys)=>(item)=>{
  let prepped = getTitle(item);
  let titlekeys = titleAndKeys(prepped.title);
  if (titlekeys === null) return null;
  prepped = Object.assign(prepped, titlekeys);

  let cb = CreateCallbacks(item);
  if (cb === null) return Immutable.fromJS(prepped);

  if (prepped.hasOwnProperty('keys')){
    let key = Object.assign({title: prepped.keys[0]}, cb);
    prepped.keys = [key];
    return Immutable.fromJS(prepped);
  }

  return Immutable.fromJS(Object.assign(prepped, cb));
};

export default (list, current = List())=>{
  let titleKeys = GetTitleAndKeys([
    ConstructFromArray
    , ConstructFromObject
    , ConstructFromString
  ]);

  let creator = CreateItem(titleKeys);

  return list.reduce((prev, curr)=>{
    let item = creator(curr);
    if (item === null) return prev;
    return Merger(prev, item);
  }, current);
};
