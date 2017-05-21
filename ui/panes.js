/* globals atc Event */
(function () {
  var panes = {}

  function getElements () {
    var collection = {}
    for (var id of arguments) {
      collection[id] = document.getElementById(id)
    }
    return collection
  }

  // run when the dom is loaded
  function setup (event) {
    panes = getElements('compose', 'list', 'view', 'preferences')

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

    select('list')
  }

  var selected = new Event('selected')

  function select (choice) {
    for (var x in panes) {
      panes[x].style.display = 'none'
      var e = document.getElementById('tab-' + x)
      if (e) {
        e.classList.remove('selected')
      }
    }
    panes[choice].style.display = 'block'
    panes[choice].dispatchEvent(selected)
    var n = 'tab-' + choice
    e = document.getElementById(n)
    if (e) {
      e.classList.add('selected')
    }
  }
  if (!atc.setup.inits) atc.setup.inits = []
  atc.setup.inits.push({name: 'setup panes', setup: setup})
})()
