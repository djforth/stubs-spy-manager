import _ from 'lodash';

function addSpy(title, ret){
  let spy    = jasmine.createSpy(title);
  // addReturn(spy, ret)
  return {title: title, spy: spy};
}

function addReturn(spy, ret){
  if (_.isObject(ret) && ret.function && ret.value){
    spy.and[ret.function](ret.value);
  }
}

function addSpyObj(title, methods){
  let keys = _.map(methods, (m)=>{
    if (_.isString(m)) return m;
    return m.title;
  });
  let spy = jasmine.createSpyObj(title, keys);

  return {title: title, spy: spy};
}

function addSpytype(title, opts){
  if (_.isArray(opts)) return addSpyObj(title, opts);

  return addSpy(title, opts);
}

function getItem(list, title){
  let obj = _.find(list, (spy)=>spy.title === title);
  if (_.isEmpty(obj)) return null;
  return obj;
}

function addSpyArray(spies){
  return _.map(spies, (m)=>{
    let title = (_.isString(m)) ? m : m.title;
    let opts  = (_.isString(m)) ? null : m.opts;
    return addSpytype(title, opts);
  });
}

function resetSpyObj(obj){
  _.forIn(obj, (v, k)=>{
    v.calls.reset();
  });
}

module.exports =  function(){
  let spies = [];

  let obj = {
    add: (modules)=>obj.addSpy(modules)
    , addSpy: (modules)=>{
      if (_.isArray(modules)){
        spies = spies.concat(addSpyArray(modules));
        return obj;
      }

      if (_.isObject(modules)){
        var [title, opts] = [modules.title, modules.opts];
        spies.push(addSpytype(title, opts));
      }

      if (_.isString(modules)){
        spies.push(addSpytype(modules, null));
      }

      return obj;
    }
    , addReturn: (title, spy_obj)=>{
      let spy = getItem(spies, title);
      if (_.isNull(spy)){
        var new_spy = (spy_obj) ? {title: title, opts: [spy_obj]} : title;
        obj.addSpy(new_spy);
        spy = getItem(spies, title);
      }
      spy = spy.spy;
      if (spy_obj) spy =  spy[spy_obj];
      return function(type, val){
        addReturn(spy, {function: type, value: val});
      };
    }
    , returnObj: (title)=>{
      let spy = getItem(spies, title).spy;
      return function(opts){
        _.forEach(opts, (opt)=>{
          spy[opt.title].and[opt.func](opt.value);
        });
      };
    }
    , getSpy: (title)=>{
      let obj = getItem(spies, title);
      if(_.isNull(obj)) return null;
      return obj.spy;
    }
    , get: (title)=>obj.getSpy(title)
    , removeAll: ()=>{
      _.forEach(spies, (s)=>{
        if (_.isPlainObject(s.spy)){
          resetSpyObj(s.spy);
        } else {
          s.spy.calls.reset();
        }
      });
      spies = [];
      return obj;
    }
    , removeSpy: (title)=>{
      spies = _.reject(spies, (s)=>{
        if (s.title !== title) return false;
        if (_.isPlainObject(s.spy)){
          resetSpyObj(s.spy);
        } else {
          s.spy.calls.reset();
        }

        return true;
      });
      return obj;
    }
  };

  return obj;
}
