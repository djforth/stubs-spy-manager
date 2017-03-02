

export default (title, keys)=>{
  return keys.reduce((obj, key)=>{
    return Object.assign(obj, {[key]: jest.fn()});
  }, {});
};
