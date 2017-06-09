/* globals atc Event */
(function () {

  function getElements () {
    var collection = {}
    for (var id of arguments) {
      collection[id] = document.getElementById(id)
    }
    return collection
  }

  // run when the dom is loaded
  function setupPanes () {
    var panes = getElements.apply(this, arguments)

    function select (choice) {
      for (var x in panes) {
        panes[x].style.display = 'none'
          var e = document.getElementById('tab-' + x)
          if (e) {
            e.classList.remove('selected')
          }
      }
      panes[choice].style.display = 'block'
      panes[choice].dispatchEvent(new Event('selected'))
      var n = 'tab-' + choice
      e = document.getElementById(n)
      if (e) {
        e.classList.add('selected')
      }
    }

    function assignListener (id) {
      var link = document.getElementById('tab-' + id)
        var pane = document.getElementById(id)
        function activate () {
          return select(id)
        }
      if (link) {
        link.addEventListener('click', activate, false)
      }
      if (pane) {
        pane.addEventListener('select', activate, false)
      }
    }

    Object.keys(panes).forEach(assignListener)

  }

  function setup(e) {
    setupPanes('compose', 'list', 'view', 'preferences', 'setup')
    setupPanes('scenario', 'secrets', 'code')
    document.getElementById('list').dispatchEvent(new Event('selected'))
  }

  if (!atc.setup.inits) atc.setup.inits = []
  atc.setup.inits.push({name: 'setup panes', setup: setup})
})()
