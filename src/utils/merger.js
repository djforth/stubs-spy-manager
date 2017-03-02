import _ from 'lodash';
import {List} from 'immutable';

const mergeKeys = (item, newitem)=>{
  let current = item.get('keys');
  current = (_.isUndefined(current)) ? List() : current;
  let keys = newitem.get('keys');
  keys = keys.filter((key)=>!current.includes(key));
  if (keys.size === 0) return item;
  return item.set('keys', current.concat(keys));
};

const makeName = (item)=>{
  let prefix = (item.get('stub')) ? '-stub' : '-spy';
  let name = item.get('title') + prefix;
  return item.set('name', name);
};

const checkTitle = (list, newitem)=>{
  let matched = list.find((item)=>item.get('title') === newitem.get('title'));
  if (!matched) return list.push(newitem);
  newitem = makeName(newitem);
  list = list.set(list.indexOf(matched), makeName(matched));
  return list.push(newitem);
};

export default (list, newitem)=>{
  let matched = list.find((item)=>{
    return item.get('title') === newitem.get('title') &&
    item.get('stub') === newitem.get('stub');
  });

  if (matched){
    if (!newitem.has('keys')) return list;
    let index = list.indexOf(matched);
    return list.set(index, mergeKeys(matched, newitem));
  }

  return checkTitle(list, newitem);
};
