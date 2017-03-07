import _ from 'lodash';

import {
  checkObj
  // , getKeys
} from './create_spies';

const checkSpy = (im)=>im.has('spy') &&
        _.isPlainObject(im.get('spy'));

// export default ()=>'for testing';

export const ClearSpy = (item)=>{
  if (checkObj(item) && checkSpy(item)){
    let spy = item.get('spy');
    let keys = Object.keys(spy);
    keys.forEach((key)=>{
      spy[key].mockClear();
    });
  } else {
    item.get('spy').mockClear();
  }
};

const mockReset = (spy)=>{
  if (_.isFunction(spy.mockReset)) spy[key].mockReset();
}

export const ResetSpy = (item)=>{
  if (checkObj(item) && checkSpy(item)){
    let spy = item.get('spy');
    let keys = Object.keys(spy);
    keys.forEach((key)=>{
      mockReset(spy[key]);
    });
  } else {
    mockReset(item.get('spy'));
  }
};
