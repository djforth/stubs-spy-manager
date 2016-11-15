
export const CheckCallBack = (item)=>{
  if (item.hasOwnProperty('callback')) return 1;
  if (item.hasOwnProperty('stub')) {
    return item.hasOwnProperty('spy') ? 2 : 0;
  }

  return item.hasOwnProperty('returnSpy') ? 3 : 0;
};

export const MakeCallback = (item)=>{
  return {callback: item.callback};
};

export const MakeSpyCallback = (title)=>{
  return {callback: {spy: true, title}};
};

export default (item)=>{
  switch (CheckCallBack(item)){
    case 1:
      return MakeCallback(item);
    case 2:
      return MakeSpyCallback(item.spy);
    case 3:
      return MakeSpyCallback(item.returnSpy);
    default:
      return null;
  }
};

