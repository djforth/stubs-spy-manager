export default (Module)=>{
  return (mod)=>{
    return Module.__get__(mod);
  };
};
