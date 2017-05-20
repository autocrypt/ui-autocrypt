(function () {
  var panes = {}

  function getElements() {
    collection = {}
    for (id of arguments) {
      collection[id] = document.getElementById(id)
    }
    return collection
  }


  // run when the dom is loaded
  function setup (event) {
    panes = getElements('compose', 'list', 'msgView', 'preferences')

    function assignListener(id) {
      var link = document.getElementById('tab-'+id)
      var pane = document.getElementById(id)
      function activate() {
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

  var selected = new Event("selected")

  function select (choice) {
    for (var x in panes) {
      panes[x].style.display = 'none'
        var e = document.getElementById('tab-' + x)
        if (e) {
          e.classList.remove('selected')
        }
    }
    panes[choice].style.display = 'block'
    var n = 'tab-' + choice
    e = document.getElementById(n)
    if (e) {
      e.classList.add('selected')
      e.dispatchEvent(selected)
    }
  }

  document.addEventListener("DOMContentLoaded", setup)

})()
