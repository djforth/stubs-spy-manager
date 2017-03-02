import CreateCallback, {
  CheckCallBack
  , MakeCallback
  , MakeSpyCallback
} from 'utils/create_callbacks';

describe('CheckCallBack', function(){
  it('should return 1 if callback in object', function(){
    expect(CheckCallBack({callback: 'foo'})).toEqual(1);
  });

  it('should return 2 if stub & spy in object', function(){
    let obj = {stub: 'foo', spy: 'bar'};
    expect(CheckCallBack(obj)).toEqual(2);
  });

  it('should return 0 if stub but no spy in object', function(){
    let obj = {stub: 'foo'};
    expect(CheckCallBack(obj)).toEqual(0);
  });

  it('should return 3 if spy & returnSpy in object', function(){
    let obj = {spy: 'foo', returnSpy: 'bar'};
    expect(CheckCallBack(obj)).toEqual(3);
  });

  it('should return 0 if spy but no returnSpy in object', function(){
    let obj = {spy: 'foo'};
    expect(CheckCallBack(obj)).toEqual(0);
  });
});

describe('MakeCallback', function(){
  it('should return object with callback', function(){
    let cb = MakeCallback({foo: 'bar', callback: 'foo'});
    expect(cb.callback).toEqual('foo');
    expect(cb.hasOwnProperty('foo')).toBeFalsy();
  });
});

describe('MakeSpyCallback', function(){
  it('should return object with callback & spy', function(){
    let cb = MakeSpyCallback('foo');
    expect(cb.callback.title).toEqual('foo');
    expect(cb.callback.spy).toBeTruthy();
  });
});

describe('CreateCallback', function(){
  let checkCallBack, makeCallback, makeSpyCallback, no;
  beforeEach(()=>{
    checkCallBack = jest.fn(()=>no);
    makeCallback = jasmine.createSpy().and.returnValue('callback');
    makeSpyCallback = jasmine.createSpy().and.returnValue('callbackSpy');

    CreateCallback.__Rewire__('CheckCallBack', checkCallBack);
    CreateCallback.__Rewire__('MakeCallback', makeCallback);
    CreateCallback.__Rewire__('MakeSpyCallback', makeSpyCallback);
  });

  afterEach(()=>{
    CreateCallback.__ResetDependency__('CheckCallBack');
    CreateCallback.__ResetDependency__('MakeCallback');
    CreateCallback.__ResetDependency__('MakeSpyCallback');
  });

  it('should make callback', function(){
    no = 1;
    let obj = {callback: 'foo'};
    let cb = CreateCallback(obj);
    expect(checkCallBack).toHaveBeenCalledWith(obj);
    expect(makeCallback).toHaveBeenCalledWith(obj);
    expect(makeSpyCallback).not.toHaveBeenCalled();
    expect(cb).toEqual('callback');
  });

  it('should make spy callback if stub', function(){
    no = 2;
    let obj = {spy: 'foo'};
    let cb = CreateCallback(obj);
    expect(checkCallBack).toHaveBeenCalledWith(obj);
    expect(makeCallback).not.toHaveBeenCalled();
    expect(makeSpyCallback).toHaveBeenCalledWith('foo');
    expect(cb).toEqual('callbackSpy');
  });

  it('should make spy callback if returnSpy', function(){
    no = 3;
    let obj = {returnSpy: 'foo'};
    let cb = CreateCallback(obj);
    expect(checkCallBack).toHaveBeenCalledWith(obj);
    expect(makeCallback).not.toHaveBeenCalled();
    expect(makeSpyCallback).toHaveBeenCalledWith('foo');
    expect(cb).toEqual('callbackSpy');
  });

  it('should return null if 0', function(){
    no = 0;
    let obj = {returnSpy: 'foo'};
    let cb = CreateCallback(obj);
    expect(checkCallBack).toHaveBeenCalledWith(obj);
    expect(makeCallback).not.toHaveBeenCalled();
    expect(makeSpyCallback).not.toHaveBeenCalled();
    expect(cb).toBeNull();
  });
});
