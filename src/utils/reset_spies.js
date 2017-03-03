import _ from 'lodash';

import {
  checkObj
  // , getKeys
} from './create_spies';

const checkSpy = (im)=>im.has('spy') &&
        _.isPlainObject(im.get('spy'));

// const getKeys = (item)=>{
//   let keys = item.get('keys');
//   return keys.map((key)=>{
//     if (Map.isMap(key)) return key.get('title');
//     return key;
//   }).toArray();
// };

export default (item)=>{
  if (checkObj(item) && checkSpy(item)){
    let spy = item.get('spy');
    let keys = Object.keys(spy);
    keys.forEach((key)=>{
      spy[key].mockReset();
    });
  } else {
    item.get('spy').mockReset();
  }
};
