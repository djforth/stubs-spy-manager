import isMatcher from './is_matchers';
import CreateMatcher from './create_matcher';

export default ()=>{
    expect.extend(isMatcher);
    expect.extend(CreateMatcher);
    expect.extend({
      equalsImmutable: CreateMatcher(
        (actual, expected)=>expected.equals(actual)
        , {
          fail: 'Immutable object :actual don\'t match :expected'
          , succ: 'Immutable objects match'
        })


      , hasKey: CreateMatcher(
          (actual, expected)=>actual.hasOwnProperty(expected)
          , {
            fail: 'Expected the object :actual to have the key :expected'
            , succ: 'The object :actual has the key :expected'
          })

      , hasImmutableKey: CreateMatcher(
          (actual, expected)=>actual.hasIn(expected)
          , {
            fail: 'The immutable object :actual has the key :expected'
            , succ: 'The immutable object has the key :expected'
          })


    , hasArrayLength: CreateMatcher(
        (actual, expected)=>actual.length === expected
        , {
          fail: 'The arrays length isn\'t :expected it\'s :actual'
          , succ: 'The arrays length is :expected'
        })
    });
};

