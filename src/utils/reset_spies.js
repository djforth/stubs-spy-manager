import _ from 'lodash';

import {
  checkObj
  , getKeys
} from './create_spies';

const checkSpy = (im)=>im.has('spy') &&
        _.isPlainObject(im.get('spy'));

export default (item)=>{
  if (checkObj(item) && checkSpy(item)){
    let spy = item.get('spy');
    let keys = getKeys(item);
    keys.forEach((key)=>{
      spy[key].mockReset();
    });
  } else {
    item.get('spy').mockReset();
  }
};
