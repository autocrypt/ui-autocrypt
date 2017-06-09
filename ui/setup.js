/* globals atc Event CustomEvent */
// setup screen - initial or multi device?
(function () {
  var dom
  var pane
  var steps


  function emit (name, detail) {
    var emitEvent = new CustomEvent(name, { detail: detail })
    pane.dispatchEvent(emitEvent)
  }

  function getElements () {
    var collection = {}
    for (var id of arguments) {
      collection[id] = document.getElementById(id)
    }
    return collection
  }

  // run when the dom is loaded
  function setup (event) {
    pane = document.getElementById('setup')
    dom = getElements('initial', 'multi', 'finish')
    steps = getElements('scenario', 'secrets', 'code')
    if (pane) {
      pane.addEventListener('select', function(e) {
        steps.scenario.dispatchEvent(new Event('select'))
      })
      pane.addEventListener('check', function(e) {
        pane.dispatchEvent(new Event('select'))
        steps.secrets.dispatchEvent(new Event('select'))
      })
      pane.addEventListener('import', function(e) {
        pane.dispatchEvent(new Event('select'))
        steps.code.dispatchEvent(new Event('select'))
      })
    }
    dom.initial.addEventListener('click', function(e) {
      emit('initialSetup')
    })
    dom.multi.addEventListener('click', function(e) {
      emit('multiSetup')
    })
    dom.finish.addEventListener('click', function(e) {
      emit('multiImport')
    })
  }

  if (!atc.setup.inits) atc.setup.inits = []
  atc.setup.inits.push({name: 'setup setup', setup: setup})

})()
