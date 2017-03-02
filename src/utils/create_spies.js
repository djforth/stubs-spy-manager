import {Map} from 'immutable';
import _ from 'lodash';

export const checkObj = (im)=>Map.isMap(im) &&
        im.has('keys') &&
        im.get('keys') !== undefined;

// const getSpyName = (item)=>{
//   if (item.has('name')) return item.get('name');
//   return item.get('title');
// };

// const getKeys = (item)=>{
//   let keys = item.get('keys');
//   return keys.map((key)=>{
//     if (Map.isMap(key)) return key.get('title');
//     return key;
//   }).toArray();
// };

const CreateMockObj = (item)=>{
  return item.get('keys').reduce((obj, key)=>{
    if (Map.isMap(key)){
      key = key.get('title');
    }
    return Object.assign(obj, {[key]: jest.fn()});
  }, {});
};

export const AddSpy = (item)=>{
  if (!Map.isMap(item) || !item.has('title')) return null;

  if (checkObj(item)){
    return CreateMockObj(item);
  }

  return jest.fn();
};

const AddCallBack = (get_callback)=>(spy, cb)=>{
  let {callback, returnSpy} = get_callback(cb);

  if (callback === null) return;

  if (_.isFunction(callback) && !returnSpy){
    spy.mockImplementation(callback);
    return;
  }

  if (_.isArray(callback)){
    callback.forEach((cb, i)=>{
      let rv = (_.isFunction(cb)) ? cb : ()=>cb;
      if (i < callback.length - 1){
        spy.mockImplementationOnce(rv);
        return;
      }
      spy.mockImplementation(rv);
    });
    // spy.and.returnValues.apply(this, callback);
    return;
  }

  spy.mockImplementation(()=>callback);
};

const GetCallBack = (list)=>(cb)=>{
  if (!Map.isMap(cb) ||
      !cb.has('spy')) return {callback: cb, returnSpy: false};
  let item = list.find((item)=>item.get('title') === cb.get('title'));
  if (!item) return null;
  return {callback: item.get('spy'), returnSpy: true};
};

const CreateCallBack = (add_callback)=>(item)=>{
  if (!item.has('spy')) return;

  if (item.has('callback')){
    add_callback(item.get('spy'), item.get('callback'));
  }

  if (item.has('keys')){
    let spyObj = item.get('spy');
    item.get('keys').forEach((key)=>{
      if (Map.isMap(key) && key.has('callback')){
        let spy = spyObj[key.get('title')];
        add_callback(spy, key.get('callback'));
      }
    });
  }
};

export default (list)=>{
  let new_list = list.map((item)=>{
    let spy = AddSpy(item);
    return item.set('spy', spy);
  });

  let get_callback = GetCallBack(new_list);
  let add_callback = AddCallBack(get_callback);
  let create_callback = CreateCallBack(add_callback);
  new_list.forEach(create_callback);

  return new_list;
};
