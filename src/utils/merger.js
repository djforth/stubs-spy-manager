import _ from 'lodash';
import {List, Map} from 'immutable';

const mergeKeys = (item, newitem)=>{
  let current = item.get('keys');
  current = (_.isUndefined(current)) ? List() : current;
  let keys = newitem.get('keys');
  keys = keys.filter((key)=>!current.includes(key));
  if (keys.size === 0) return item;
  return item.set('keys', current.concat(keys));
};

const checkTitle = (list, newitem)=>{
  let matched = list.find((item)=>item.get('title') === newitem.get('title'));
  if (!matched) return newitem;
  let prefix = (newitem.get('stub')) ? '-stub' : '-spy';
  let name = newitem.get('title') + prefix;
  return newitem.set('name', name)
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

  return list.push(checkTitle(list, newitem));
};
