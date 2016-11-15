import _ from 'lodash';
import {List, Map} from 'immutable';

import {
  Splitter
} from './title_keys';

const FindSpies = (list, title, stub)=>{
  let name = (stub) ? `${title}-stub` : `${title}-spy`;
  let filtered = list.filter((item)=>{
    return item.get('title') === title && item.has('spy');
  });

  if (filtered.size === 0) return null;
  if (filtered.size === 1) return filtered.first();
  return filtered.find((item)=>item.get('name') === name);
};

const getTitleAndKey = (t)=>{
  t = Splitter(t);
  if (_.isArray(t)){
    let [title, key] = t;
    return {title, key};
  }
  if (typeof t === 'string') return {title: t};
  if (_.isPlainObject(t) && t.hasOwnProperty('title')) return t;

  return null;
};

export default (list, title, stub = false)=>{
  if (!List.isList(list) || list.size === 0) return null;
  let tk = getTitleAndKey(title);
  if (tk === null) return tk;
  let spyMap = FindSpies(list, tk.title, stub);
  if (!Map.isMap(spyMap) || !spyMap.has('spy')) return null;

  let spy = spyMap.get('spy');

  if (tk.hasOwnProperty('key')) return spy[tk.key];
  return spy;
};
