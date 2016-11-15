import GetTitleAndKeys, {
  ConstructFromArray
  , ConstructFromObject
  , ConstructFromString
  , Splitter
} from '../../src/utils/title_keys';

describe('splitter', function(){
  it('should return object if object passed', function(){
    let obj = {title: 'foo', keys: ['bar']};
    expect(Splitter(obj)).toEqual(obj);
  });

  it('should return a string if string passed', function(){
    expect(Splitter('foo')).toEqual('foo');
  });

  it('should return a array if string passed with .', function(){
    expect(Splitter('foo.bar')).toEqual(['foo', 'bar']);
  });
});

describe('ConstructFromArray', function(){
  it('should return null if not array', function(){
    expect(ConstructFromArray('foo')).toBeNull();
  });

  it('should return object with title & key if array > 1', function(){
    let {title, keys} = ConstructFromArray(['foo', 'bar', 'phil']);
    expect(title).toEqual('foo');
    expect(keys).toEqual(['bar', 'phil']);
  });

  it('should return object with title if array === 1', function(){
    let item = ConstructFromArray(['foo']);
    expect(item.title).toEqual('foo');
    expect(item.hasOwnProperty('keys')).toBeFalsy();
  });
});

describe('ConstructFromObject', function(){
  it('should return null if not array', function(){
    expect(ConstructFromObject('foo')).toBeNull();
  });

  it('should return null if not correct object', function(){
    expect(ConstructFromObject({foo: 'bar'})).toBeNull();
  });

  it('should return object if correct', function(){
    let {title, keys} = ConstructFromObject({title: 'foo', keys: ['bar', 'phil']});
    expect(title).toEqual('foo');
    expect(keys).toEqual(['bar', 'phil']);
  });
});

describe('ConstructFromString', function(){
  it('should return null if not a string', function(){
    expect(ConstructFromString({foo: 'bar'})).toBeNull();
  });

  it('should return object if a string', function(){
    let {title} = ConstructFromString('foo');
    expect(title).toEqual('foo');
  });
});

describe('GetTitleAndKeys', function(){
  let spy1, spy2, titleKeys, v1, v2;
  beforeEach(()=>{
    v1 = v2 = null;
    spy1 = jasmine.createSpy().and.callFake(()=>v1);
    spy2 = jasmine.createSpy().and.callFake(()=>v2);
    titleKeys = GetTitleAndKeys([spy1, spy2]);
  });

  it('should return function', function(){
    expect(_.isFunction(titleKeys)).toBeTruthy();
  });

  it('should return bar on first run', function(){
    v2  = {title: 'bar'};
    let {title} = titleKeys('bar');
    expect(title).toEqual('bar');
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  it('should return foo on second run', function(){
    v1  = {title: 'foo'};
    let {title} = titleKeys('foo');
    expect(title).toEqual('foo');
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(0);
  });

  it('should return foo on first run', function(){
    v1 = v2 = null;
    let title = titleKeys('foo');
    expect(title).toBeNull();
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });
});