const _ = require("lodash");

const spyManager = require("./spy_manager")();

function getItem(list, title){
  let obj = _.find(list, (spy)=>spy.title === title);
  if (_.isEmpty(obj)) return null;
  return obj;
}

function spyCreator(Module, manager){
  return function(mod){
    let title = (_.isString(mod)) ? mod : mod.title;
    let spy    = manager.addSpy(mod).getSpy(title);
    Module.__set__(title, spy);
    return {title: title, spy: spy};
  };
}

function resetSpy(spy){
  if (_.isPlainObject(spy)){
    _.forIn(spy, function(v, k){
      v.calls.reset();
    });
  } else {
    spy.calls.reset();
  }
}

module.exports =  function(Module){
  let spies  = [];
  let addSpy = spyCreator(Module, spyManager);
  let obj = {
    add: (modules)=>obj.addSpy(modules)
    , addSpy: (modules)=>{
      if (_.isArray(modules)){
        modules = _.map(modules, (m)=>{
          return addSpy(m);
        });

        spies = spies.concat(modules);
        return obj;
      }

      if (_.isString(modules) ||
        _.isObject(modules)){
        spies.push(addSpy(modules));
      }

      return obj;
    }
    , get: (title)=>obj.getSpy(title)
    , getSpy: (title)=>{
      let obj = getItem(spies, title);
      if (_.isNull(obj)) return null;
      return obj.spy;
    }
    , return: (title, mod_obj)=>{
      let mod = getItem(spies, title);
      if (_.isNull(mod)){
        var new_spy = (mod_obj) ? {title: title, opts: [mod_obj]} : title;
        obj.addSpy(new_spy);
        mod = getItem(spies, title);
      }

      mod = mod.spy;
      if (mod_obj) mod = mod[mod_obj];
      return function(func, value){
        mod.and[func](value);
      };
    }
    , returnObj: (title)=>{
      let mod = getItem(spies, title).spy;
      return function(opts){
        _.forEach(opts, (opt)=>{
          mod[opt.title].and[opt.func](opt.value);
        });
      };
    }
    , revertAll: ()=>{
      _.forEach(spies, (mod)=>{
        resetSpy(mod.spy);
        // mod.revert();
        Module.__ResetDependency__(mod.title);
      });
      spies = [];
    }
    , revertSpy: (title)=>{
      let mod = getItem(spies, title);
      resetSpy(mod.spy);
      // mod.revert()
      Module.__ResetDependency__(mod.title);
      spies = _.reject(spies, (s)=>s.title === title);
      return mod;
    }
    , setSpies: (spy_list)=>{
      _.forEach(spy_list, (sl)=>{
        let mod = getItem(spies, sl.title);
        mod.spy.and[sl.func](sl.value);
      });
    }
  };

  return obj;
};
