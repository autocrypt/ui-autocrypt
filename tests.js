var Tests = (function () {
  var env = {specs: {}, prefix: ''}
  var assertions = 0
  var failures = 0

  function log (message) {
    console.log('%c' + message, 'color: #444')
  }

  function fail (message) {
    console.log('%c' + message, 'color: red')
  }

  function assert (truth, message) {
    assertions = assertions + 1
    if (!truth) {
      failures = failures + 1
      fail('   ' + message)
    }
  };

  assert.equal = function (expected, observed) {
    assert(observed === expected,
        'Expected "' + observed + '" to be "' + expected + '".')
  }

  assert.ok = function (observed) {
    assert(observed === true,
      'Expected "' + observed + '" to be true."')
  }

  assert.exist = function (key, obj) {
    if (typeof obj !== 'object') fail('expected an object, got a', typeof observed)
    assert(obj[key] !== undefined,
        'key' + key + 'does not exists')
  }
  assert.notEqual = function (unexpected, observed) {
    assert(observed !== unexpected,
        'Expected somethign else than "' + unexpected + '".')
  }

  assert.content = function (text, id) {
    var elem = document.getElementById(id)
    assert(elem.innerText === text,
        id + ' should contain "' + text + '".')
  }

  assert.selector = function (selector) {
    var elem = document.querySelector(selector)
    assert(elem,
                'Expected to find element matching "' + selector + '".')
  }

  async function run () {
    var arr = Object.entries(this.specs)
    var setup = this.setup
    var teardown = this.teardown
    var prefix = this.prefix
    if (arr.length === 0) return
    for (let suite of arr) {
      var name = suite[0]
      var fun = suite[1]
      var env = {specs: {}, prefix: prefix + '  '}
      log(prefix + name)
      if (setup) setup()
      // run the description block.
      // It's either a test that will be run right away
      // Or its a nested descripion that will seed the specs in env
      await fun.bind(env)(describe.bind(env), assert)
      // recurse
      await run.bind(env)()
      if (teardown) teardown()
    };
    console.log(report(), 'color: green', 'color: red')
    return report()
  };

  function report () {
    if (failures > 0) {
      return '%c' + assertions + ' assertions. ' + '%c' + failures + ' failures.'
    }
    else {
      return '%c' + assertions + ' assertions. %c'
    }
  }

  function describe (context, fun) {
    this.specs[context] = fun
  };

  async function runTests () {
    assertions = 0
    failures = 0
    console.log(await run.bind(env)())
  };

  return {
    describe: describe.bind(env),
    run: runTests
  }
}())
