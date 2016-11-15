
export const StubMethod = (Module)=>(title, spy)=>{
  Module.__Rewire__(title, spy);
};

export const ResetStub = (Module)=>(title)=>{
  Module.__ResetDependency__(title);
};

export default (module)=>{
  let creator = StubMethod(module);
  let reset = ResetStub(module);

  return (list)=>{
    list.forEach((item)=>{
      let title = item.get('title');
      let spy = item.get('spy');
      creator(title, spy);
    });

    return ()=>{
      list.forEach((item)=>{
        reset(item.get('title'));
      });
    };
  };
};
