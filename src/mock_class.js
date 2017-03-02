import _ from 'lodash';

function addMethods(ClassConst, methods){
  return _.map(methods, (m)=>{
    let title = (_.isString(m)) ? m : m.title;
    let spy = jasmine.createSpy(title);
    ClassConst.prototype[title] = spy;
    return {title: title, spy: spy};
  });
}

export default (title, methods)=>{
  let init  = jasmine.createSpy('init');
  let spies = [{title: 'init', spy: init}];
  let ConstClass = function(...args){
    init(...args);
  };

  if (_.isArray(methods) && !_.isEmpty(methods)){
    spies = spies.concat(addMethods(ConstClass, methods));
  }

  return {
    getMock: ()=>{
      return ConstClass;
    }
    , getConstSpy: ()=>{
      let obj = _.find(spies, (spy)=>spy.title === 'init');
      return obj.spy;
    }
    , getSpy: (spy_name)=>{
      let obj = _.find(spies, (spy)=>spy.title === spy_name);
      return obj.spy;
    }
  };
};
