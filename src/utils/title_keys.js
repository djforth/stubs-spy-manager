import _ from 'lodash';

export const Splitter = (t)=>{
  if (typeof t === 'string' && t.match(/\./)){
    return t.split('.');
  }
  return t;
};

export const ConstructFromArray = (split)=>{
  if (_.isArray(split)){
    if (split.length === 1){
      return  {title: split[0]};
    }

    return {
      title: split[0]
      , keys: split.slice(1, split.length)
    };
  }

  return null;
};

export const ConstructFromObject = (split)=>{
  if (_.isPlainObject(split) &&
    split.hasOwnProperty('title') &&
    split.hasOwnProperty('keys')){
    return split;
  }

  return null;
};

export const ConstructFromString = (split)=>{
  if (typeof split === 'string'){
    return {title: split};
  }

  return null;
};

export default (checks)=>(split)=>{
  return checks.reduce((value, check)=>{
    if (value !== null) return value;
    return check(split);
  }, null);
};
