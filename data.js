
[
  {
    stub: 'foo.bar'
    , spy: 'bar'
  }
  , {
    spy: 'bar'
    , callback 'foo'
  }
  , {
    stub: ['foo', 'phil']
    , callback: 'Phil'
  }
  , {
    stub: 'Bar'
    , spy: 'foo'
  }
  , {
    spy: 'foo.bar2'
    ,returnSpy: 'bar2'
  }
  , {
    spy: 'bar2'
    , callback: ()=>'bar2'
  }
]

[
  {
    stub: 'foo.bar3'
    callback: 'bar3'
  }
  , {
    spy: 'bar'
    callback: ()=>'bar'
  }
]

[
  {
    title: 'foo'
    , stub: true
    , keys: [
      {title:'bar', callback:{spy: true, title: 'bar'}
      , {title:'phil', callback:'Phil'}
      , {title:'bar3', callback:'bar3'}
    ], keys: [
      {title:'bar', callback:{spy: true, title: 'bar'}
      , {title:'phil', callback:'Phil'}
      , {title:'bar3', callback:'bar3'}
    ]
  }
  , {
    title: 'bar'
    , stub: false
    , callback: 'foo'
  }
  , {
    title: 'bar2'
    , stub: false
    , callback: 'foo'
  }
  , {
    title: 'Bar'
    , stub: true
    , callback: {spy: true, title: 'foo'}
  }
  , {
    title: 'foo'
    , stub: false
    , name: 'foo-spy'
    , callback: {spy: true, title: 'bar2'}
  }
  , {
    title: 'foo'
    , stub: false
    , name: 'foo-spy'
    , callback: {spy: true, title: 'bar2'}
  }
]